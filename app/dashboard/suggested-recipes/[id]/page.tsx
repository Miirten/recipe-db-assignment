import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchIngredientsByRecipeId,
  fetchStepsByRecipeId,
  fetchSuggestedRecipeById,
} from "@/app/lib/data";

type SuggestedRecipePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SuggestedRecipePage({
  params,
}: SuggestedRecipePageProps) {
  const { id } = await params;

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id,
    );

  if (!isUuid) {
    notFound();
  }

  const recipe = await fetchSuggestedRecipeById(id);

  if (!recipe) {
    notFound();
  }

  const [ingredients, steps] = await Promise.all([
    fetchIngredientsByRecipeId(recipe.id),
    fetchStepsByRecipeId(recipe.id),
  ]);

  return (
    <section className="mx-auto max-w-4xl">
      <Link
        href="/dashboard/suggested-recipes"
        className="text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
      >
        ← Back to Suggested Recipes
      </Link>

      <header className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Recipe idea
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
              {recipe.title}
            </h1>

            {recipe.description ? (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600 md:text-base">
                {recipe.description}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            {recipe.cook_time_minutes ? (
              <span className="rounded-full bg-orange-100 px-3 py-1.5 text-sm font-semibold text-orange-800">
                {recipe.cook_time_minutes} min
              </span>
            ) : null}

            {recipe.servings ? (
              <span className="rounded-full bg-stone-100 px-3 py-1.5 text-sm font-semibold text-stone-700">
                {recipe.servings} servings
              </span>
            ) : null}

            {recipe.approximate_cost !== null ? (
              <span className="rounded-full bg-stone-100 px-3 py-1.5 text-sm font-semibold text-stone-700">
                ${Number(recipe.approximate_cost).toFixed(2)}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-stone-900">Ingredients</h2>

          {ingredients.length === 0 ? (
            <p className="mt-4 text-sm text-stone-600">
              No ingredients have been added for this recipe.
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-stone-200 rounded-lg border border-stone-200">
              {ingredients.map((ingredient) => (
                <li key={ingredient.id} className="p-4">
                  <p className="font-medium text-stone-900">
                    {ingredient.quantity ? `${ingredient.quantity} ` : ""}
                    {ingredient.unit ? `${ingredient.unit} ` : ""}
                    {ingredient.name}
                  </p>

                  {ingredient.price !== null ? (
                    <p className="mt-1 text-sm text-stone-500">
                      Est. ${Number(ingredient.price).toFixed(2)}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-stone-900">Instructions</h2>

          {steps.length === 0 ? (
            <p className="mt-4 text-sm text-stone-600">
              No instructions have been added for this recipe.
            </p>
          ) : (
            <ol className="mt-5 space-y-5">
              {steps.map((step) => (
                <li key={step.id} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                    {step.position}
                  </span>

                  <p className="pt-1 text-sm leading-6 text-stone-700">
                    {step.instruction}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      {recipe.notes ? (
        <section className="mt-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-stone-900">Notes</h2>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-stone-700">
            {recipe.notes}
          </p>
        </section>
      ) : null}

      <div className="mt-8">
        <Link
          href="/dashboard/my-recipes/new"
          className="inline-flex rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
        >
          Create your own recipe
        </Link>
      </div>
    </section>
  );
}