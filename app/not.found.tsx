import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
        404
      </p>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900">
        Page not found
      </h1>

      <p className="mt-4 text-sm leading-6 text-stone-600">
        This recipe may have been deleted, is unavailable, or the address is incorrect.
      </p>

      <Link
        href="/dashboard/my-recipes"
        className="mx-auto mt-7 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
      >
        Go to My Recipes
      </Link>
    </section>
  );
}