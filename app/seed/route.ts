import bcrypt from "bcryptjs";
import postgres from "postgres";
import { NextResponse } from "next/server";


const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

export async function GET() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS recipes (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        cook_time_minutes INTEGER,
        approximate_cost NUMERIC(10, 2),
        servings INTEGER,
        ingredients TEXT,
        instructions TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS ingredients (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        quantity VARCHAR(100),
        unit VARCHAR(100),
        price NUMERIC(10, 2),
        position INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      ALTER TABLE ingredients
      ADD COLUMN IF NOT EXISTS position INTEGER;
    `;

    await sql`
      WITH ranked_ingredients AS (
        SELECT
          id,
          ROW_NUMBER() OVER (
            PARTITION BY recipe_id
            ORDER BY created_at ASC
          ) AS new_position
        FROM ingredients
        WHERE position IS NULL
      )
      UPDATE ingredients
      SET position = ranked_ingredients.new_position
      FROM ranked_ingredients
      WHERE ingredients.id = ranked_ingredients.id;
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS recipe_steps (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        instruction TEXT NOT NULL,
        position INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (recipe_id, position)
      );
    `;

    const demoName = "Demo User";
    const demoEmail = "demo@recipebook.com";
    const password = await bcrypt.hash("123456", 10);

    const users = await sql<{ id: string }[]>`
      INSERT INTO users (name, email, password)
      VALUES (${demoName}, ${demoEmail}, ${password})
      ON CONFLICT (email) DO UPDATE
      SET name = EXCLUDED.name
      RETURNING id;
    `;

    const demoUserId = users[0].id;

    const recipeTitle = "Creamy Garlic Pasta";

    const existingRecipes = await sql<{ id: string }[]>`
      SELECT id
      FROM recipes
      WHERE user_id = ${demoUserId}
        AND title = ${recipeTitle}
      LIMIT 1;
    `;

    let demoRecipeId: string;

    if (existingRecipes.length > 0) {
      demoRecipeId = existingRecipes[0].id;
    } else {
      const recipeDescription =
        "A quick, comforting pasta recipe with garlic, Parmesan, and a creamy sauce.";
      const cookTime = 25;
      const approximateCost = 9.5;
      const servings = 4;
      const instructions =
        "1. Cook pasta according to package directions.\n2. Sauté garlic in olive oil.\n3. Add cream and Parmesan.\n4. Toss pasta with sauce.\n5. Season and serve.";
      const notes =
        "Add spinach or grilled chicken for a more filling meal.";

      const newRecipes = await sql<{ id: string }[]>`
        INSERT INTO recipes (
          user_id,
          title,
          description,
          cook_time_minutes,
          approximate_cost,
          servings,
          instructions,
          notes
        )
        VALUES (
          ${demoUserId},
          ${recipeTitle},
          ${recipeDescription},
          ${cookTime},
          ${approximateCost},
          ${servings},
          ${instructions},
          ${notes}
        )
        RETURNING id;
      `;

      demoRecipeId = newRecipes[0].id;
    }

    const demoIngredients = [
      {
        name: "Pasta",
        quantity: "12",
        unit: "oz",
        price: 1.99,
        position: 1,
      },
      {
        name: "Olive oil",
        quantity: "2",
        unit: "tablespoons",
        price: null,
        position: 2,
      },
      {
        name: "Garlic",
        quantity: "3",
        unit: "cloves",
        price: 0.5,
        position: 3,
      },
      {
        name: "Heavy cream",
        quantity: "1",
        unit: "cup",
        price: 2.49,
        position: 4,
      },
      {
        name: "Parmesan cheese",
        quantity: "1/2",
        unit: "cup",
        price: null,
        position: 5,
      },
    ];

    for (const ingredient of demoIngredients) {
      const existingIngredients = await sql<{ id: string }[]>`
        SELECT id
        FROM ingredients
        WHERE recipe_id = ${demoRecipeId}
          AND name = ${ingredient.name}
        LIMIT 1;
      `;

      if (existingIngredients.length === 0) {
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
            ${demoRecipeId},
            ${ingredient.name},
            ${ingredient.quantity},
            ${ingredient.unit},
            ${ingredient.price},
            ${ingredient.position}
          );
        `;
      }
    }

    const demoSteps = [
      {
        instruction: "Cook pasta according to package directions.",
        position: 1,
      },
      {
        instruction: "Sauté garlic in olive oil over medium heat.",
        position: 2,
      },
      {
        instruction:
          "Add cream and Parmesan cheese, then stir until the sauce is smooth.",
        position: 3,
      },
      {
        instruction: "Toss the cooked pasta with the sauce.",
        position: 4,
      },
      {
        instruction: "Season with salt and pepper, then serve.",
        position: 5,
      },
    ];

    for (const step of demoSteps) {
      const existingSteps = await sql<{ id: string }[]>`
        SELECT id
        FROM recipe_steps
        WHERE recipe_id = ${demoRecipeId}
          AND position = ${step.position}
        LIMIT 1;
      `;

      if (existingSteps.length === 0) {
        await sql`
          INSERT INTO recipe_steps (
            recipe_id,
            instruction,
            position
          )
          VALUES (
            ${demoRecipeId},
            ${step.instruction},
            ${step.position}
          );
        `;
      }
    }

    return NextResponse.json({
      message:
        "Users, recipes, ingredients, and recipe steps tables created and seeded.",
    });
  } catch (error) {
    console.error("Seed error:", error);

    return NextResponse.json(
      { error: "Failed to seed database." },
      { status: 500 },
    );
  }
}