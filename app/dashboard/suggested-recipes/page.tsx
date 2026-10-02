import Link from "next/link";
import { fetchSuggestedRecipes } from "@/app/lib/data";

export default async function SuggestedRecipesPage() {
  const recipes = await fetchSuggestedRecipes();

  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            Recipe ideas
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
            Suggested Recipes
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 md:text-base">
            Browse hand-picked recipe ideas from RecipeBook.
          </p>
        </div>

      </div>

      {recipes.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center">
          <h2 className="text-lg font-bold text-stone-900">
            No suggested recipes yet
          </h2>

          <p className="mt-2 text-sm text-stone-600">
            Check back soon for new recipe ideas.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {recipes.map(recipe => (
            <article
              key={recipe.id}
              className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100 text-xl">
                  🍲
                </div>

                {recipe.cook_time_minutes ? (
                  <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600">
                    {recipe.cook_time_minutes} min
                  </span>
                ) : null}
              </div>

              <h2 className="mt-5 text-xl font-bold text-stone-900">
                {recipe.title}
              </h2>

              <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600">
                {recipe.description ?? "No description has been added yet."}
              </p>

              <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-stone-200 pt-4 text-sm">
                <div>
                  <dt className="text-stone-500">Servings</dt>
                  <dd className="mt-1 font-semibold text-stone-800">
                    {recipe.servings ?? "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-stone-500">Est. cost</dt>
                  <dd className="mt-1 font-semibold text-stone-800">
                    {recipe.approximate_cost !== null
                      ? `$${Number(recipe.approximate_cost).toFixed(2)}`
                      : "—"}
                  </dd>
                </div>
              </dl>

              <Link
  href={`/dashboard/suggested-recipes/${recipe.id}`}
  className="mt-5 inline-block text-sm font-semibold text-orange-600 hover:text-orange-700"
>
  View recipe →
</Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}