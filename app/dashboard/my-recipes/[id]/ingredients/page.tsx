import Link from "next/link";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import {
  fetchIngredientsByRecipeId,
  fetchRecipeByIdAndUserId,
} from "@/app/lib/data";
import RecipeTabs from "@/app/ui/dashboard/recipe-tabs";

type IngredientsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function IngredientsPage({
  params,
}: IngredientsPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id,
    );

  if (!isUuid) {
    notFound();
  }

  const recipe = await fetchRecipeByIdAndUserId(id, session.user.id);

  if (!recipe) {
    notFound();
  }

  const ingredients = await fetchIngredientsByRecipeId(recipe.id);

  return (
    <section className="mx-auto max-w-6xl">
      <Link
        href="/dashboard/my-recipes"
        className="text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
      >
        ← Back to My Recipes
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          My Recipes
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
          {recipe.title}
        </h1>
      </div>

      <div className="mt-8 rounded-xl border border-stone-200 bg-white shadow-sm">
        <RecipeTabs recipeId={recipe.id} />

        <div className="p-6">
          <h2 className="text-xl font-bold text-stone-900">Ingredients</h2>

          {ingredients.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-5">
              <p className="text-sm font-medium text-stone-700">
                No ingredients yet
              </p>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                This recipe does not have any ingredients saved.
              </p>
            </div>
          ) : (
            <ul className="mt-6 divide-y divide-stone-200 overflow-hidden rounded-lg border border-stone-200">
              {ingredients.map((ingredient) => (
                <li
                  key={ingredient.id}
                  className="flex items-center justify-between gap-4 bg-white p-4"
                >
                  <div>
                    <p className="font-medium text-stone-900">
                      {ingredient.quantity
                        ? `${ingredient.quantity} `
                        : ""}
                      {ingredient.unit ? `${ingredient.unit} ` : ""}
                      {ingredient.name}
                    </p>

                    {ingredient.price !== null ? (
                      <p className="mt-1 text-sm text-stone-500">
                        Est. ${Number(ingredient.price).toFixed(2)}
                      </p>
                    ) : null}
                  </div>

                  <span className="text-sm text-stone-400">
                    #{ingredient.position}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}