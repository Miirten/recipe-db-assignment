"use client";

import Link from "next/link";

type DashboardErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function DashboardError({
  error,
  reset,
}: DashboardErrorProps) {
  console.error("Dashboard error:", error);

  return (
    <section className="mx-auto max-w-xl rounded-xl border border-red-200 bg-red-50 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
        Something went wrong
      </p>

      <h1 className="mt-2 text-2xl font-bold text-stone-900">
        We could not load this recipe content.
      </h1>

      <p className="mt-3 text-sm leading-6 text-stone-700">
        Please try again. If the issue continues, return to your recipe list.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
        >
          Try again
        </button>

        <Link
          href="/dashboard/my-recipes"
          className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
        >
          My Recipes
        </Link>
      </div>
    </section>
  );
}