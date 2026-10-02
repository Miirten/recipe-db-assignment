"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { z } from "zod";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

const RegisterSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(255),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const IngredientSchema = z.object({
  name: z.string().trim(),
  quantity: z.string().trim(),
  unit: z.string().trim(),
  price: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        (/^\d+(\.\d{1,2})?$/.test(value) &&
          Number(value) >= 0 &&
          Number(value) <= 100000),
      {
        message:
          "Ingredient price must be a non-negative amount with up to two decimal places.",
      },
    ),
});

const RecipeStepSchema = z.object({
  instruction: z.string().trim(),
});

const RecipeDetailsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Recipe title is required.")
    .max(255, "Recipe title must be 255 characters or fewer."),

  description: z
    .string()
    .trim()
    .max(2000, "Description must be 2,000 characters or fewer.")
    .optional(),

  cookTime: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        value === "" ||
        (/^\d+$/.test(value) &&
          Number(value) >= 0 &&
          Number(value) <= 1440),
      {
        message: "Cook time must be a whole number from 0 to 1,440 minutes.",
      },
    ),

  approximateCost: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        value === "" ||
        (/^\d+(\.\d{1,2})?$/.test(value) &&
          Number(value) >= 0 &&
          Number(value) <= 100000),
      {
        message:
          "Estimated cost must be a non-negative amount with up to two decimal places.",
      },
    ),

  servings: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        value === "" ||
        (/^\d+$/.test(value) &&
          Number(value) >= 1 &&
          Number(value) <= 1000),
      {
        message: "Servings must be a whole number from 1 to 1,000.",
      },
    ),

  notes: z
    .string()
    .trim()
    .max(5000, "Notes must be 5,000 characters or fewer.")
    .optional(),
});

const CreateRecipeSchema = RecipeDetailsSchema.extend({
  ingredients: z
    .array(IngredientSchema)
    .refine(
      (ingredients) =>
        ingredients.some((ingredient) => ingredient.name.trim().length > 0),
      {
        message: "Add at least one ingredient.",
      },
    ),

  steps: z
    .array(RecipeStepSchema)
    .refine(
      (steps) => steps.some((step) => step.instruction.trim().length > 0),
      {
        message: "Add at least one instruction step.",
      },
    ),
});

export type RecipeFormState = {
  message: string;
  errors: {
    title?: string[];
    ingredients?: string[];
    steps?: string[];
  };
};

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function authenticate(
  _previousState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return "Invalid email or password.";
      }

      return "Something went wrong. Please try again.";
    }

    throw error;
  }
}

export async function createRecipe(
  _previousState: RecipeFormState,
  formData: FormData,
): Promise<RecipeFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  let rawIngredients: unknown;
  let rawSteps: unknown;

  try {
    rawIngredients = JSON.parse(
      formData.get("ingredients")?.toString() ?? "[]",
    );

    rawSteps = JSON.parse(
      formData.get("steps")?.toString() ?? "[]",
    );
  } catch {
  return {
    message: "Ingredients or instructions contain invalid data.",
    errors: {},
  };
}

  const parsed = CreateRecipeSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    cookTime: formData.get("cookTime"),
    approximateCost: formData.get("approximateCost"),
    servings: formData.get("servings"),
    notes: formData.get("notes"),
    ingredients: rawIngredients,
    steps: rawSteps,
  });

  if (!parsed.success) {
    const flattenedErrors = parsed.error.flatten();

    return {
      message: "Please correct the highlighted fields.",
      errors: {
        title: flattenedErrors.fieldErrors.title,
        ingredients: flattenedErrors.fieldErrors.ingredients,
        steps: flattenedErrors.fieldErrors.steps,
      },
    };
  }

  const {
    title,
    description,
    cookTime,
    approximateCost,
    servings,
    notes,
    ingredients,
    steps,
  } = parsed.data;

  const cookTimeMinutes = cookTime ? Number.parseInt(cookTime, 10) : null;

  const cost = approximateCost
    ? Number.parseFloat(approximateCost)
    : null;

  const servingCount = servings
    ? Number.parseInt(servings, 10)
    : null;

  const validIngredients = ingredients.filter((ingredient) =>
    ingredient.name.trim(),
  );

  const validSteps = steps.filter((step) => step.instruction.trim());

  try {
    const recipes = await sql<{ id: string }[]>`
      INSERT INTO recipes (
        user_id,
        title,
        description,
        cook_time_minutes,
        approximate_cost,
        servings,
        notes,
        is_suggested
      )
      VALUES (
        ${session.user.id},
        ${title},
        ${description || null},
        ${cookTimeMinutes},
        ${cost},
        ${servingCount},
        ${notes || null},
        FALSE
      )
      RETURNING id;
    `;

    const recipeId = recipes[0]?.id;

    if (!recipeId) {
      throw new Error("Failed to create recipe.");
    }

    for (let index = 0; index < validIngredients.length; index += 1) {
      const ingredient = validIngredients[index];
      const priceText = ingredient.price.trim();

      const price = priceText
        ? Number.parseFloat(priceText)
        : null;

      await sql`
        INSERT INTO ingredients (
          recipe_id,
          name,
          quantity,
          unit,
          price,
          position
        )
        VALUES (
          ${recipeId},
          ${ingredient.name.trim()},
          ${ingredient.quantity.trim() || null},
          ${ingredient.unit.trim() || null},
          ${price},
          ${index + 1}
        );
      `;
    }

    for (let index = 0; index < validSteps.length; index += 1) {
      const step = validSteps[index];

      await sql`
        INSERT INTO recipe_steps (
          recipe_id,
          instruction,
          position
        )
        VALUES (
          ${recipeId},
          ${step.instruction.trim()},
          ${index + 1}
        );
      `;
    }
  } catch (error) {
    console.error("Create recipe error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to create recipe. Please try again.");
  }

  revalidatePath("/dashboard/my-recipes");
  revalidatePath("/dashboard/suggested-recipes");

  redirect("/dashboard/my-recipes");

  return {
  message: "",
  errors: {},
};
}

export async function updateRecipe(recipeId: string, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (!isValidUuid(recipeId)) {
    throw new Error("Invalid recipe ID.");
  }

  const parsed = RecipeDetailsSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    cookTime: formData.get("cookTime"),
    approximateCost: formData.get("approximateCost"),
    servings: formData.get("servings"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "Invalid recipe data.",
    );
  }

  const {
    title,
    description,
    cookTime,
    approximateCost,
    servings,
    notes,
  } = parsed.data;

  const cookTimeMinutes = cookTime ? Number.parseInt(cookTime, 10) : null;

  const cost = approximateCost
    ? Number.parseFloat(approximateCost)
    : null;

  const servingCount = servings
    ? Number.parseInt(servings, 10)
    : null;

  try {
    const updatedRecipes = await sql<{ id: string }[]>`
      UPDATE recipes
      SET
        title = ${title},
        description = ${description || null},
        cook_time_minutes = ${cookTimeMinutes},
        approximate_cost = ${cost},
        servings = ${servingCount},
        notes = ${notes || null},
        updated_at = NOW()
      WHERE id = ${recipeId}
        AND user_id = ${session.user.id}
        AND is_suggested = FALSE
      RETURNING id;
    `;

    if (updatedRecipes.length === 0) {
      throw new Error(
        "Recipe not found or you do not have permission to edit it.",
      );
    }
  } catch (error) {
    console.error("Update recipe error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to update recipe. Please try again.");
  }

  revalidatePath("/dashboard/my-recipes");
  revalidatePath(`/dashboard/my-recipes/${recipeId}`);

  redirect(`/dashboard/my-recipes/${recipeId}`);
}

export async function deleteRecipe(recipeId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (!isValidUuid(recipeId)) {
    throw new Error("Invalid recipe ID.");
  }

  try {
    const ownedRecipes = await sql<{ id: string }[]>`
      SELECT id
      FROM recipes
      WHERE id = ${recipeId}
        AND user_id = ${session.user.id}
        AND is_suggested = FALSE;
    `;

    if (ownedRecipes.length === 0) {
      throw new Error("You do not have permission to delete this recipe.");
    }

    await sql`
      DELETE FROM ingredients
      WHERE recipe_id = ${recipeId};
    `;

    await sql`
      DELETE FROM recipe_steps
      WHERE recipe_id = ${recipeId};
    `;

    await sql`
      DELETE FROM recipes
      WHERE id = ${recipeId}
        AND user_id = ${session.user.id}
        AND is_suggested = FALSE;
    `;
  } catch (error) {
    console.error("Delete recipe error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to delete recipe. Please try again.");
  }

  revalidatePath("/dashboard/my-recipes");
  revalidatePath(`/dashboard/my-recipes/${recipeId}`);

  redirect("/dashboard/my-recipes");
}

export async function registerUser(
  _previousState: string | undefined,
  formData: FormData,
) {
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Invalid registration data.";
  }

  const { name, password } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const users = await sql<{ id: string }[]>`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${passwordHash})
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `;

    if (users.length === 0) {
      return "An account with that email already exists.";
    }
  } catch (error) {
    console.error("Registration error:", error);
    return "Database error: could not create account.";
  }

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });
}