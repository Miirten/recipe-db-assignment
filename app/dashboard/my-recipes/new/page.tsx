import Link from "next/link";
import CreateRecipeForm from "@/app/ui/dashboard/create-recipe-form";

export default function NewRecipePage() {
  return (
    <section className="mx-auto max-w-5xl">
      <Link
        href="/dashboard/my-recipes"
        className="text-sm font-semibold text-orange-600 hover:text-orange-700"
      >
        ← Back to My Recipes
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          My Recipes
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
          Create a recipe
        </h1>

        <p className="mt-3 text-sm leading-6 text-stone-600 md:text-base">
          Add the recipe details, ingredients, cooking steps, and your personal
          notes.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
        <CreateRecipeForm />
      </div>
    </section>
  );
}