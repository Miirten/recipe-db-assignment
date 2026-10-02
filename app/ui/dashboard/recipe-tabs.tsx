import Link from "next/link";

type RecipeTabsProps = {
  recipeId: string;
};

export default function RecipeTabs({ recipeId }: RecipeTabsProps) {
  return (
    <nav
      aria-label="Recipe sections"
      className="mt-8 border-b border-stone-200"
    >
      <ul className="flex gap-1 overflow-x-auto">
        <li className="shrink-0">
          <Link
            href={`/dashboard/my-recipes/${recipeId}`}
            className="block border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-stone-600 transition-colors hover:border-orange-300 hover:text-orange-700"
          >
            Overview
          </Link>
        </li>

        <li className="shrink-0">
          <Link
            href={`/dashboard/my-recipes/${recipeId}/ingredients`}
            className="block border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-stone-600 transition-colors hover:border-orange-300 hover:text-orange-700"
          >
            Ingredients
          </Link>
        </li>

        <li className="shrink-0">
          <Link
            href={`/dashboard/my-recipes/${recipeId}/instructions`}
            className="block border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-stone-600 transition-colors hover:border-orange-300 hover:text-orange-700"
          >
            Instructions
          </Link>
        </li>

        <li className="shrink-0">
          <Link
            href={`/dashboard/my-recipes/${recipeId}/notes`}
            className="block border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-stone-600 transition-colors hover:border-orange-300 hover:text-orange-700"
          >
            Notes
          </Link>
        </li>
      </ul>
    </nav>
  );
}