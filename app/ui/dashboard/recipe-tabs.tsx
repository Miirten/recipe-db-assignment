import Link from "next/link";

const tabs = [
  {
    name: "Overview",
    href: "/dashboard/my-recipes",
  },
  {
    name: "Ingredients",
    href: "/dashboard/my-recipes/ingredients",
  },
  {
    name: "Instructions",
    href: "/dashboard/my-recipes/instructions",
  },
  {
    name: "Notes",
    href: "/dashboard/my-recipes/notes",
  },
];

export default function RecipeTabs() {
  return (
    <nav
      aria-label="Recipe sections"
      className="border-b border-stone-200"
    >
      <ul className="flex gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <li key={tab.href} className="shrink-0">
            <Link
              href={tab.href}
              className="block border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-stone-600 transition-colors hover:border-orange-300 hover:text-orange-700"
            >
              {tab.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}