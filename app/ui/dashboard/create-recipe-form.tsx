"use client";

import { useState } from "react";
import { createRecipe } from "@/app/actions";

type IngredientInput = {
  name: string;
  quantity: string;
  unit: string;
  price: string;
};

type StepInput = {
  instruction: string;
};

const emptyIngredient = (): IngredientInput => ({
  name: "",
  quantity: "",
  unit: "",
  price: "",
});

const emptyStep = (): StepInput => ({
  instruction: "",
});

export default function CreateRecipeForm() {
  const [ingredients, setIngredients] = useState<IngredientInput[]>([
    emptyIngredient(),
  ]);

  const [steps, setSteps] = useState<StepInput[]>([
    emptyStep(),
  ]);

  function updateIngredient(
    index: number,
    field: keyof IngredientInput,
    value: string,
  ) {
    setIngredients(current =>
      current.map((ingredient, ingredientIndex) =>
        ingredientIndex === index
          ? { ...ingredient, [field]: value }
          : ingredient,
      ),
    );
  }

  function removeIngredient(index: number) {
    setIngredients(current =>
      current.length === 1
        ? [emptyIngredient()]
        : current.filter((_, ingredientIndex) => ingredientIndex !== index),
    );
  }

  function updateStep(index: number, value: string) {
    setSteps(current =>
      current.map((step, stepIndex) =>
        stepIndex === index ? { instruction: value } : step,
      ),
    );
  }

  function removeStep(index: number) {
    setSteps(current =>
      current.length === 1
        ? [emptyStep()]
        : current.filter((_, stepIndex) => stepIndex !== index),
    );
  }

  return (
    <form action={createRecipe} className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-stone-900">
          Recipe details
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-stone-700"
            >
              Recipe name
            </label>

            <input
              id="title"
              name="title"
              required
              placeholder="Example: Creamy Garlic Pasta"
              className="mt-2 block w-full rounded-lg border border-stone-300 px-3 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-stone-700"
            >
              Brief description
            </label>

            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Describe the recipe in one or two sentences."
              className="mt-2 block w-full rounded-lg border border-stone-300 px-3 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label
              htmlFor="cookTime"
              className="block text-sm font-medium text-stone-700"
            >
              Cook time in minutes
            </label>

            <input
              id="cookTime"
              name="cookTime"
              type="number"
              min="0"
              placeholder="30"
              className="mt-2 block w-full rounded-lg border border-stone-300 px-3 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label
              htmlFor="servings"
              className="block text-sm font-medium text-stone-700"
            >
              Servings
            </label>

            <input
              id="servings"
              name="servings"
              type="number"
              min="1"
              placeholder="4"
              className="mt-2 block w-full rounded-lg border border-stone-300 px-3 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label
              htmlFor="approximateCost"
              className="block text-sm font-medium text-stone-700"
            >
              Approximate total cost
            </label>

            <input
              id="approximateCost"
              name="approximateCost"
              type="number"
              min="0"
              step="0.01"
              placeholder="12.50"
              className="mt-2 block w-full rounded-lg border border-stone-300 px-3 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200 pt-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Ingredients</h2>
            <p className="mt-1 text-sm text-stone-600">
              Price is optional for each ingredient.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIngredients(current => [...current, emptyIngredient()])
            }
            className="rounded-lg border border-orange-300 px-3 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
          >
            + Add ingredient
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-lg border border-stone-200 p-4 md:grid-cols-[1fr_0.7fr_0.8fr_0.7fr_auto]"
            >
              <input
                value={ingredient.name}
                onChange={event =>
                  updateIngredient(index, "name", event.target.value)
                }
                placeholder="Ingredient name"
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
              />

              <input
                value={ingredient.quantity}
                onChange={event =>
                  updateIngredient(index, "quantity", event.target.value)
                }
                placeholder="Amount"
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
              />

              <input
                value={ingredient.unit}
                onChange={event =>
                  updateIngredient(index, "unit", event.target.value)
                }
                placeholder="Unit"
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
              />

              <input
                value={ingredient.price}
                onChange={event =>
                  updateIngredient(index, "price", event.target.value)
                }
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
              />

              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <input
          type="hidden"
          name="ingredients"
          value={JSON.stringify(ingredients)}
        />
      </section>

      <section className="border-t border-stone-200 pt-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Instructions
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Steps are saved in the order shown.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSteps(current => [...current, emptyStep()])}
            className="rounded-lg border border-orange-300 px-3 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
          >
            + Add step
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border border-stone-200 p-4"
            >
              <span className="mt-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                {index + 1}
              </span>

              <textarea
                value={step.instruction}
                onChange={event => updateStep(index, event.target.value)}
                rows={2}
                placeholder={`Step ${index + 1}`}
                className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
              />

              <button
                type="button"
                onClick={() => removeStep(index)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <input type="hidden" name="steps" value={JSON.stringify(steps)} />
      </section>

      <section className="border-t border-stone-200 pt-8">
        <label
          htmlFor="notes"
          className="block text-xl font-bold text-stone-900"
        >
          Notes
        </label>

        <p className="mt-1 text-sm text-stone-600">
          Add substitutions, ratings, or reminders.
        </p>

        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Example: Use extra garlic next time."
          className="mt-4 block w-full rounded-lg border border-stone-300 px-3 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </section>

      <div className="flex justify-end gap-3 border-t border-stone-200 pt-6">
        <button
          type="submit"
          className="rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
        >
          Create recipe
        </button>
      </div>
    </form>
  );
}