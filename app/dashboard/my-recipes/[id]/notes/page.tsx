import Link from "next/link";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { fetchRecipeByIdAndUserId } from "@/app/lib/data";
import RecipeTabs from "@/app/ui/dashboard/recipe-tabs";

type NotesPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NotesPage({
  params,
}: NotesPageProps) {
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
          <h2 className="text-xl font-bold text-stone-900">Notes</h2>

          <p className="mt-2 text-sm text-stone-600">
            Save substitutions, ratings, reminders, and other personal details.
          </p>

          {recipe.notes ? (
            <p className="mt-6 whitespace-pre-wrap rounded-lg border border-stone-200 bg-stone-50 p-5 text-sm leading-7 text-stone-700">
              {recipe.notes}
            </p>
          ) : (
            <div className="mt-6 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-5">
              <p className="text-sm font-medium text-stone-700">
                No notes yet
              </p>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                This recipe does not have any personal notes saved.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}