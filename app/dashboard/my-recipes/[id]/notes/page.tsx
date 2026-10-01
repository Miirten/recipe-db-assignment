import RecipeTabs from "@/app/ui/dashboard/recipe-tabs";

export default function NotesPage() {
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
          <h2 className="text-xl font-bold text-stone-900">Notes</h2>

          <p className="mt-2 text-sm text-stone-600">
            Save substitutions, ratings, reminders, and other personal details.
          </p>

          <div className="mt-6 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-5">
            <p className="text-sm font-medium text-stone-700">
              Notes placeholder
            </p>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              Example: “Use extra garlic next time,” “This serves 3 instead of
              4,” or “Great with a green salad.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}