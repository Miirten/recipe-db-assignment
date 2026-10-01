import Link from "next/link";

export default function Page() {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 px-6 py-12 text-white shadow-sm md:px-10 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">
          Welcome to RecipeBook
        </p>

        <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
          Make your favorite recipes easy to find again.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-orange-50 md:text-lg">
          Discover recipe ideas, save your own creations, and keep ingredients
          and instructions organized in one place.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/recipes"
            className="rounded-lg bg-white px-4 py-3 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-50"
          >
            Browse suggested recipes
          </Link>

          <Link
            href="/my-recipes"
            className="rounded-lg border border-white/70 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            View my recipes
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-orange-600">
              Get started
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-900">
              Everything you need to organize recipes
            </h2>
          </div>

          <Link
            href="/recipes/new"
            className="w-fit rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
          >
            Create a recipe
          </Link>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <Link
            href="/recipes"
            className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-lg">
              🍲
            </div>

            <h3 className="mt-4 text-lg font-semibold text-stone-900">
              Suggested recipes
            </h3>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              Browse recipe ideas and find something new to make.
            </p>

            <p className="mt-4 text-sm font-semibold text-orange-600">
              Browse recipes →
            </p>
          </Link>

          <Link
            href="/my-recipes"
            className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-lg">
              📖
            </div>

            <h3 className="mt-4 text-lg font-semibold text-stone-900">
              My recipe collection
            </h3>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              View, update, and organize the recipes you have created.
            </p>

            <p className="mt-4 text-sm font-semibold text-orange-600">
              View my recipes →
            </p>
          </Link>

          <Link
            href="/recipes/new"
            className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-lg">
              ✍️
            </div>

            <h3 className="mt-4 text-lg font-semibold text-stone-900">
              Add a recipe
            </h3>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              Save ingredients, instructions, and a photo for a recipe you
              want to remember.
            </p>

            <p className="mt-4 text-sm font-semibold text-orange-600">
              Create recipe →
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}