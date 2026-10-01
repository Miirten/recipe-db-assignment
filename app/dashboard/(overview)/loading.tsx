export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse">
      <div className="h-52 rounded-2xl bg-orange-100 md:h-64" />

      <div className="mt-10">
        <div className="h-4 w-24 rounded bg-stone-200" />
        <div className="mt-3 h-8 w-72 max-w-full rounded bg-stone-200" />

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div className="h-56 rounded-xl bg-white shadow-sm" />
          <div className="h-56 rounded-xl bg-white shadow-sm" />
          <div className="h-56 rounded-xl bg-white shadow-sm" />
        </div>
      </div>
    </div>
  );
}