import Link from "next/link";
import LogoutButton from "@/app/ui/dashboard/logout-button";

const links = [
  {
    name: "Home",
    href: "/dashboard",
  },
  {
    name: "Log in",
    href: "/login",
  },
  {
    name: "Suggested Recipes",
    href: "/dashboard/suggested-recipes",
  },
  {
    name: "My Recipes",
    href: "/dashboard/my-recipes",
  },
];

export default function SideNav() {
  return (
    <aside className="w-full border-b border-stone-200 bg-white p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="mb-6">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-orange-600"
        >
          RecipeBook
        </Link>

        <p className="mt-1 text-sm text-stone-500">
          Save and share recipes you love.
        </p>
      </div>

      <nav aria-label="Main navigation">
        <ul className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {links.map(link => (
            <li key={link.href} className="shrink-0">
              <Link
                href={link.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-orange-50 hover:text-orange-700"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-6 border-t border-stone-200 pt-4">
  <LogoutButton />
</div>
    </aside>
  );
}