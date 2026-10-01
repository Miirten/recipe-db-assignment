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

export async function authenticate(
  previousState: string | undefined,
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

export async function createRecipe(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const cookTimeValue = formData.get("cookTime")?.toString().trim();
  const costValue = formData.get("approximateCost")?.toString().trim();
  const servingsValue = formData.get("servings")?.toString().trim();
  const notes = formData.get("notes")?.toString().trim() || null;

  if (!title) {
    throw new Error("Recipe title is required.");
  }

  const cookTime = cookTimeValue ? Number.parseInt(cookTimeValue, 10) : null;
  const approximateCost = costValue ? Number.parseFloat(costValue) : null;
  const servings = servingsValue
    ? Number.parseInt(servingsValue, 10)
    : null;

  const ingredients = JSON.parse(
    formData.get("ingredients")?.toString() ?? "[]",
  ) as Array<{
    name: string;
    quantity: string;
    unit: string;
    price: string;
  }>;

  const steps = JSON.parse(
    formData.get("steps")?.toString() ?? "[]",
  ) as Array<{
    instruction: string;
  }>;

  const recipes = await sql<{ id: string }[]>`
    INSERT INTO recipes (
      user_id,
      title,
      description,
      cook_time_minutes,
      approximate_cost,
      servings,
      notes
    )
    VALUES (
      ${session.user.id},
      ${title},
      ${description},
      ${cookTime},
      ${approximateCost},
      ${servings},
      ${notes}
    )
    RETURNING id;
  `;

  const recipeId = recipes[0].id;

  const validIngredients = ingredients.filter(ingredient =>
    ingredient.name.trim(),
  );

  for (let index = 0; index < validIngredients.length; index += 1) {
    const ingredient = validIngredients[index];

    const quantity = ingredient.quantity.trim() || null;
    const unit = ingredient.unit.trim() || null;
    const priceText = ingredient.price.trim();
    const price = priceText ? Number.parseFloat(priceText) : null;

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
        ${quantity},
        ${unit},
        ${price},
        ${index + 1}
      );
    `;
  }

  const validSteps = steps.filter(step => step.instruction.trim());

  for (let index = 0; index < validSteps.length; index += 1) {
    await sql`
      INSERT INTO recipe_steps (
        recipe_id,
        instruction,
        position
      )
      VALUES (
        ${recipeId},
        ${validSteps[index].instruction.trim()},
        ${index + 1}
      );
    `;
  }

  revalidatePath("/dashboard/my-recipes");

  redirect("/dashboard/my-recipes");
}

export async function registerUser(
  previousState: string | undefined,
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