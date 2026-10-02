"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { updateRecipe } from "@/app/actions";
import type { Recipe } from "@/app/lib/definitions";

type EditRecipeFormProps = {
  recipe: Recipe;
};

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

export default function EditRecipeForm({
  recipe,
}: EditRecipeFormProps) {
  const updateRecipeWithId = updateRecipe.bind(null, recipe.id);

  return (
    <form action={updateRecipeWithId} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-stone-800"
        >
          Recipe title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          defaultValue={recipe.title}
          required
          maxLength={255}
          className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-stone-900"
        />
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
          defaultValue={recipe.description ?? ""}
          className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-stone-900"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label
            htmlFor="cookTime"
            className="block text-sm font-semibold text-stone-800"
          >
            Cook time (minutes)
          </label>

          <input
            id="cookTime"
            name="cookTime"
            type="number"
            min="0"
            max="1440"
            defaultValue={recipe.cook_time_minutes ?? ""}
            className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-stone-900"
          />
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
            defaultValue={recipe.servings ?? ""}
            className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-stone-900"
          />
        </div>

        <div>
          <label
            htmlFor="approximateCost"
            className="block text-sm font-semibold text-stone-800"
          >
            Estimated cost
          </label>

          <input
            id="approximateCost"
            name="approximateCost"
            type="number"
            min="0"
            step="0.01"
            defaultValue={recipe.approximate_cost ?? ""}
            className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-stone-900"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-semibold text-stone-800"
        >
          Notes
        </label>

        <textarea
          id="notes"
          name="notes"
          rows={5}
          defaultValue={recipe.notes ?? ""}
          className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-stone-900"
        />
      </div>

      <div className="flex flex-wrap gap-3 border-t border-stone-200 pt-6">
        <SaveButton />

        <Link
          href={`/dashboard/my-recipes/${recipe.id}`}
          className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}