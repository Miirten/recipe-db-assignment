import Link from "next/link";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { fetchRecipeByIdAndUserId } from "@/app/lib/data";
import EditRecipeForm from "@/app/ui/dashboard/edit-recipe-form";

type EditRecipePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditRecipePage({
  params,
}: EditRecipePageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const recipe = await fetchRecipeByIdAndUserId(id, session.user.id);

  if (!recipe) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-3xl">
      <Link
        href={`/dashboard/my-recipes/${recipe.id}`}
        className="text-sm font-semibold text-orange-600 hover:text-orange-700"
      >
        ← Back to recipe
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-stone-900">
        Edit {recipe.title}
      </h1>

      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <EditRecipeForm recipe={recipe} />
      </div>
    </section>
  );
}