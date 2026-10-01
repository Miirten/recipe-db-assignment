import RecipeTabs from "@/app/ui/dashboard/recipe-tabs";

export default function InstructionsPage() {
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
          <h2 className="text-xl font-bold text-stone-900">Instructions</h2>

          <p className="mt-2 text-sm text-stone-600">
            Add the cooking steps for this recipe here.
          </p>

          <div className="mt-6 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-5">
            <p className="text-sm font-medium text-stone-700">
              Instructions placeholder
            </p>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              Example: 1. Boil the pasta. 2. Heat olive oil and cook garlic.
              3. Toss the pasta with the sauce. 4. Serve with Parmesan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}