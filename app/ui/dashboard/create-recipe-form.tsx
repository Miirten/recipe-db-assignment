"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  createRecipe,
  type RecipeFormState,
} from "@/app/actions";

type IngredientInput = {
  name: string;
  quantity: string;
  unit: string;
  price: string;
};

type StepInput = {
  instruction: string;
};

const initialState: RecipeFormState = {
  message: "",
  errors: {},
};

const emptyIngredient: IngredientInput = {
  name: "",
  quantity: "",
  unit: "",
  price: "",
};

const emptyStep: StepInput = {
  instruction: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Creating recipe…" : "Create recipe"}
    </button>
  );
}

export default function CreateRecipeForm() {
  const [state, formAction] = useActionState(
    createRecipe,
    initialState,
  );

  const [ingredients, setIngredients] = useState<IngredientInput[]>([
    { ...emptyIngredient },
  ]);

  const [steps, setSteps] = useState<StepInput[]>([
    { ...emptyStep },
  ]);

  function updateIngredient(
    index: number,
    field: keyof IngredientInput,
    value: string,
  ) {
    setIngredients((currentIngredients) =>
      currentIngredients.map((ingredient, ingredientIndex) =>
        ingredientIndex === index
          ? { ...ingredient, [field]: value }
          : ingredient,
      ),
    );
  }

  function addIngredient() {
    setIngredients((currentIngredients) => [
      ...currentIngredients,
      { ...emptyIngredient },
    ]);
  }

  function removeIngredient(index: number) {
    setIngredients((currentIngredients) => {
      if (currentIngredients.length === 1) {
        return [{ ...emptyIngredient }];
      }

      return currentIngredients.filter(
        (_, ingredientIndex) => ingredientIndex !== index,
      );
    });
  }

  function updateStep(index: number, instruction: string) {
    setSteps((currentSteps) =>
      currentSteps.map((step, stepIndex) =>
        stepIndex === index ? { ...step, instruction } : step,
      ),
    );
  }

  function addStep() {
    setSteps((currentSteps) => [
      ...currentSteps,
      { ...emptyStep },
    ]);
  }

  function removeStep(index: number) {
    setSteps((currentSteps) => {
      if (currentSteps.length === 1) {
        return [{ ...emptyStep }];
      }

      return currentSteps.filter(
        (_, stepIndex) => stepIndex !== index,
      );
    });
  }

  return (
    <form action={formAction} className="space-y-8">
      {state.message ? (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          role="alert"
          aria-live="polite"
        >
          {state.message}
        </div>
      ) : null}

      <section>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            Recipe details
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
            Create a recipe
          </h1>

          <p className="mt-3 text-sm leading-6 text-stone-600">
            Add the main details, ingredients, and instructions for your recipe.
          </p>
        </div>

        <div className="mt-6 grid gap-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-stone-800"
            >
              Recipe title <span className="text-red-600">*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={255}
              aria-invalid={Boolean(state.errors?.title?.length)}
              aria-describedby={
                state.errors?.title?.length
                  ? "title-error"
                  : undefined
              }
              className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              placeholder="For example, Creamy Garlic Pasta"
            />

            {state.errors?.title?.map((error, index) => (
              <p
                id={index === 0 ? "title-error" : undefined}
                key={`title-error-${index}`}
                className="mt-2 text-sm font-medium text-red-600"
              >
                {error}
              </p>
            ))}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-stone-800"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={4}
              maxLength={2000}
              className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              placeholder="Describe the recipe, flavor, occasion, or serving idea."
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label
                htmlFor="cookTime"
                className="block text-sm font-semibold text-stone-800"
              >
                Cook time
              </label>

              <div className="relative mt-2">
                <input
                  id="cookTime"
                  name="cookTime"
                  type="number"
                  min="0"
                  max="1440"
                  step="1"
                  className="w-full rounded-lg border border-stone-300 px-3 py-2.5 pr-16 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  placeholder="30"
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                  min
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="servings"
                className="block text-sm font-semibold text-stone-800"
              >
                Servings
              </label>

              <input
                id="servings"
                name="servings"
                type="number"
                min="1"
                max="1000"
                step="1"
                className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                placeholder="4"
              />
            </div>

            <div>
              <label
                htmlFor="approximateCost"
                className="block text-sm font-semibold text-stone-800"
              >
                Estimated cost
              </label>

              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">
                  $
                </span>

                <input
                  id="approximateCost"
                  name="approximateCost"
                  type="number"
                  min="0"
                  max="100000"
                  step="0.01"
                  className="w-full rounded-lg border border-stone-300 py-2.5 pl-7 pr-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  placeholder="12.50"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
        aria-describedby={
          state.errors?.ingredients?.length
            ? "ingredients-error"
            : undefined
        }
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Ingredients
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              Add at least one ingredient.
            </p>
          </div>

          <button
            type="button"
            onClick={addIngredient}
            className="w-fit rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-100"
          >
            + Add ingredient
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {ingredients.map((ingredient, index) => (
            <div
              key={`ingredient-${index}`}
              className="rounded-lg border border-stone-200 bg-stone-50 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="pt-2 text-sm font-semibold text-stone-800">
                  Ingredient {index + 1}
                </p>

                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
                  aria-label={`Remove ingredient ${index + 1}`}
                >
                  Remove
                </button>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-12">
                <div className="sm:col-span-5">
                  <label
                    htmlFor={`ingredient-name-${index}`}
                    className="block text-sm font-medium text-stone-700"
                  >
                    Ingredient name
                  </label>

                  <input
                    id={`ingredient-name-${index}`}
                    type="text"
                    value={ingredient.name}
                    onChange={(event) =>
                      updateIngredient(index, "name", event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    placeholder="Pasta"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`ingredient-quantity-${index}`}
                    className="block text-sm font-medium text-stone-700"
                  >
                    Quantity
                  </label>

                  <input
                    id={`ingredient-quantity-${index}`}
                    type="text"
                    value={ingredient.quantity}
                    onChange={(event) =>
                      updateIngredient(index, "quantity", event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    placeholder="12"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`ingredient-unit-${index}`}
                    className="block text-sm font-medium text-stone-700"
                  >
                    Unit
                  </label>

                  <input
                    id={`ingredient-unit-${index}`}
                    type="text"
                    value={ingredient.unit}
                    onChange={(event) =>
                      updateIngredient(index, "unit", event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    placeholder="oz"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor={`ingredient-price-${index}`}
                    className="block text-sm font-medium text-stone-700"
                  >
                    Est. price
                  </label>

                  <div className="relative mt-2">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">
                      $
                    </span>

                    <input
                      id={`ingredient-price-${index}`}
                      type="number"
                      min="0"
                      max="100000"
                      step="0.01"
                      value={ingredient.price}
                      onChange={(event) =>
                        updateIngredient(index, "price", event.target.value)
                      }
                      className="w-full rounded-lg border border-stone-300 bg-white py-2.5 pl-7 pr-3 text-stone-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      placeholder="2.99"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <input
          type="hidden"
          name="ingredients"
          value={JSON.stringify(ingredients)}
        />

        {state.errors?.ingredients?.map((error, index) => (
          <p
            id={index === 0 ? "ingredients-error" : undefined}
            key={`ingredient-error-${index}`}
            className="mt-4 text-sm font-medium text-red-600"
          >
            {error}
          </p>
        ))}
      </section>

      <section
        className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
        aria-describedby={
          state.errors?.steps?.length ? "steps-error" : undefined
        }
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Instructions
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              Add at least one step.
            </p>
          </div>

          <button
            type="button"
            onClick={addStep}
            className="w-fit rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-100"
          >
            + Add step
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {steps.map((step, index) => (
            <div
              key={`step-${index}`}
              className="rounded-lg border border-stone-200 bg-stone-50 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <label
                  htmlFor={`step-instruction-${index}`}
                  className="pt-2 text-sm font-semibold text-stone-800"
                >
                  Step {index + 1}
                </label>

                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
                  aria-label={`Remove instruction step ${index + 1}`}
                >
                  Remove
                </button>
              </div>

              <textarea
                id={`step-instruction-${index}`}
                rows={3}
                value={step.instruction}
                onChange={(event) =>
                  updateStep(index, event.target.value)
                }
                className="mt-4 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                placeholder="Describe what to do for this step."
              />
            </div>
          ))}
        </div>

        <input
          type="hidden"
          name="steps"
          value={JSON.stringify(steps)}
        />

        {state.errors?.steps?.map((error, index) => (
          <p
            id={index === 0 ? "steps-error" : undefined}
            key={`step-error-${index}`}
            className="mt-4 text-sm font-medium text-red-600"
          >
            {error}
          </p>
        ))}
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <label
          htmlFor="notes"
          className="block text-sm font-semibold text-stone-800"
        >
          Notes
        </label>

        <p className="mt-1 text-sm text-stone-600">
          Optional reminders, substitutions, serving ideas, or preparation notes.
        </p>

        <textarea
          id="notes"
          name="notes"
          rows={5}
          maxLength={5000}
          className="mt-4 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          placeholder="For example, reserve some pasta water before draining."
        />
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t border-stone-200 pt-6">
        <SubmitButton />

        <Link
          href="/dashboard/my-recipes"
          className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}