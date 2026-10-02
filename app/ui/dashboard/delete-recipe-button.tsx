"use client";

import { useFormStatus } from "react-dom";
import { deleteRecipe } from "@/app/actions";

type DeleteRecipeButtonProps = {
  recipeId: string;
  recipeTitle: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete recipe"}
    </button>
  );
}

export default function DeleteRecipeButton({
  recipeId,
  recipeTitle,
}: DeleteRecipeButtonProps) {
  const deleteRecipeWithId = deleteRecipe.bind(null, recipeId);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const confirmed = window.confirm(
      `Delete "${recipeTitle}"? This permanently removes its ingredients and instructions.`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteRecipeWithId} onSubmit={handleSubmit}>
      <SubmitButton />
    </form>
  );
}