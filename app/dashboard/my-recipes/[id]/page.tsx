import Link from "next/link";
import { auth } from "@/auth";
import { fetchRecipeByIdAndUserId } from "@/app/lib/data";
import { notFound, redirect } from "next/navigation";

type RecipePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RecipePage({ params }: RecipePageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const recipe = await fetchRecipeByIdAndUserId(id, session.user.id);

  if (!recipe) {
    notFound();
  }

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
          Recipe overview
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
          {recipe.title}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 md:text-base">
          {recipe.description ?? "No description has been added yet."}
        </p>
      </div>

      <nav
        aria-label="Recipe sections"
        className="mt-8 border-b border-stone-200"
      >
        <ul className="flex gap-1 overflow-x-auto">
          <li className="shrink-0">
            <Link
              href={`/dashboard/my-recipes/${recipe.id}`}
              className="block border-b-2 border-orange-600 px-4 py-3 text-sm font-semibold text-orange-700"
            >
              Overview
            </Link>
          </li>

          <li className="shrink-0">
            <Link
              href={`/dashboard/my-recipes/${recipe.id}/ingredients`}
              className="block border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-stone-600 hover:border-orange-300 hover:text-orange-700"
            >
              Ingredients
            </Link>
          </li>

          <li className="shrink-0">
            <Link
              href={`/dashboard/my-recipes/${recipe.id}/instructions`}
              className="block border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-stone-600 hover:border-orange-300 hover:text-orange-700"
            >
              Instructions
            </Link>
          </li>

          <li className="shrink-0">
            <Link
              href={`/dashboard/my-recipes/${recipe.id}/notes`}
              className="block border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-stone-600 hover:border-orange-300 hover:text-orange-700"
            >
              Notes
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Cook time
          </p>

          <p className="mt-2 text-lg font-bold text-stone-900">
            {recipe.cook_time_minutes
              ? `${recipe.cook_time_minutes} minutes`
              : "Not added"}
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Servings
          </p>

          <p className="mt-2 text-lg font-bold text-stone-900">
            {recipe.servings ?? "Not added"}
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Approximate cost
          </p>

          <p className="mt-2 text-lg font-bold text-stone-900">
            {recipe.approximate_cost != null
              ? `$${Number(recipe.approximate_cost).toFixed(2)}`
              : "Not added"}
          </p>
        </div>
      </div>
    </section>
  );
}