import postgres from "postgres";
import type { Ingredient, Recipe } from "@/app/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

export async function fetchAllRecipes() {
  try {
    const recipes = await sql<Recipe[]>`
      SELECT
        id,
        user_id,
        title,
        description,
        cook_time_minutes,
        approximate_cost,
        servings,
        ingredients,
        instructions,
        notes,
        created_at,
        updated_at
      FROM recipes
      ORDER BY created_at DESC;
    `;

    return recipes;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch recipes.");
  }
}

export async function fetchRecipesByUserId(userId: string) {
  try {
    const recipes = await sql<Recipe[]>`
      SELECT
        id,
        user_id,
        title,
        description,
        cook_time_minutes,
        approximate_cost,
        servings,
        ingredients,
        instructions,
        notes,
        created_at,
        updated_at
      FROM recipes
      WHERE user_id = ${userId}
      ORDER BY created_at DESC;
    `;

    return recipes;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch your recipes.");
  }
}

export async function fetchRecipeById(recipeId: string) {
  try {
    const recipes = await sql<Recipe[]>`
      SELECT
        id,
        user_id,
        title,
        description,
        cook_time_minutes,
        approximate_cost,
        servings,
        ingredients,
        instructions,
        notes,
        created_at,
        updated_at
      FROM recipes
      WHERE id = ${recipeId}
      LIMIT 1;
    `;

    return recipes[0] ?? null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch recipe.");
  }
}

export async function fetchRecipeByIdAndUserId(
  recipeId: string,
  userId: string,
) {
  try {
    const recipes = await sql<Recipe[]>`
      SELECT
        id,
        user_id,
        title,
        description,
        cook_time_minutes,
        approximate_cost,
        servings,
        ingredients,
        instructions,
        notes,
        created_at,
        updated_at
      FROM recipes
      WHERE id = ${recipeId}
        AND user_id = ${userId}
      LIMIT 1;
    `;

    return recipes[0] ?? null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch recipe.");
  }
}

export async function fetchIngredientsByRecipeId(recipeId: string) {
  try {
    const ingredients = await sql<Ingredient[]>`
      SELECT
        id,
        recipe_id,
        name,
        quantity,
        unit,
        price,
        position,
        created_at,
        updated_at
      FROM ingredients
      WHERE recipe_id = ${recipeId}
      ORDER BY position ASC;
    `;

    return ingredients;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch ingredients.");
  }
}