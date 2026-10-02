import Link from "next/link";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import {
  fetchRecipeByIdAndUserId,
  fetchStepsByRecipeId,
} from "@/app/lib/data";
import RecipeTabs from "@/app/ui/dashboard/recipe-tabs";

type InstructionsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InstructionsPage({
  params,
}: InstructionsPageProps) {
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

  const steps = await fetchStepsByRecipeId(recipe.id);

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
          <h2 className="text-xl font-bold text-stone-900">
            Instructions
          </h2>

          {steps.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-5">
              <p className="text-sm font-medium text-stone-700">
                No instructions yet
              </p>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                This recipe does not have any cooking steps saved.
              </p>
            </div>
          ) : (
            <ol className="mt-6 space-y-5">
              {steps.map((step) => (
                <li key={step.id} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                    {step.position}
                  </span>

                  <p className="pt-1 text-sm leading-6 text-stone-700">
                    {step.instruction}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}