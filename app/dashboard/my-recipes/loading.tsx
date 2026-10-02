export default function MyRecipesLoading() {
  return (
    <section
      className="mx-auto max-w-6xl animate-pulse"
      aria-label="Loading your recipes"
    >
      <div className="h-5 w-28 rounded bg-stone-200" />
      <div className="mt-4 h-10 w-60 rounded bg-stone-200" />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-64 rounded-xl border border-stone-200 bg-white p-6"
          >
            <div className="h-11 w-11 rounded-lg bg-stone-200" />
            <div className="mt-6 h-6 w-3/4 rounded bg-stone-200" />
            <div className="mt-3 h-4 w-full rounded bg-stone-200" />
          </div>
        ))}
      </div>
    </section>
  );
}