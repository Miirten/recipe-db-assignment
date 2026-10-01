import RecipeTabs from "@/app/ui/dashboard/recipe-tabs";

export default function IngredientsPage() {
  return (
    <section className="mx-auto max-w-6xl">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          My Recipes
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
          Your recipe name
        </h1>
      </div>

      <div className="mt-8 rounded-xl border border-stone-200 bg-white shadow-sm">
        <RecipeTabs />

        <div className="p-6">
          <h2 className="text-xl font-bold text-stone-900">Ingredients</h2>

          <p className="mt-2 text-sm text-stone-600">
            Add ingredients and their amounts here.
          </p>

          <div className="mt-6 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-5">
            <p className="text-sm font-medium text-stone-700">
              Ingredients placeholder
            </p>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              Example: 2 cups pasta, 1 tablespoon olive oil, 3 cloves garlic,
              and 1/2 cup Parmesan cheese.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}