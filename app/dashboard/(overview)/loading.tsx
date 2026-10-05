export default function DashboardOverviewLoading() {
  return (
    <section
      className="mx-auto max-w-6xl animate-pulse"
      aria-label="Loading dashboard"
    >
      <div className="h-5 w-28 rounded bg-stone-200" />

      <div className="mt-4 h-10 w-72 max-w-full rounded bg-stone-200" />

      <div className="mt-3 h-5 w-full max-w-2xl rounded bg-stone-200" />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="h-11 w-11 rounded-lg bg-stone-200" />
              <div className="h-6 w-16 rounded-full bg-stone-200" />
            </div>

            <div className="mt-6 h-6 w-3/4 rounded bg-stone-200" />

            <div className="mt-3 h-4 w-full rounded bg-stone-200" />
            <div className="mt-2 h-4 w-5/6 rounded bg-stone-200" />

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-stone-200 pt-4">
              <div>
                <div className="h-3 w-14 rounded bg-stone-200" />
                <div className="mt-2 h-5 w-10 rounded bg-stone-200" />
              </div>

              <div>
                <div className="h-3 w-16 rounded bg-stone-200" />
                <div className="mt-2 h-5 w-12 rounded bg-stone-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}