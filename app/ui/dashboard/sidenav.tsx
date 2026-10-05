import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function SideNav() {
  const session = await auth();
  const userName = session?.user?.name?.trim();

  return (
    <aside className="flex h-full flex-col bg-orange-600 p-4 md:w-64">
      <Link
        href="/"
        className="rounded-lg px-3 py-3 text-xl font-bold text-white hover:bg-orange-700"
      >
        RecipeBook
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        <Link
          href="/dashboard/suggested-recipes"
          className="rounded-lg px-3 py-2.5 text-sm font-semibold text-orange-50 transition hover:bg-orange-700"
        >
          Suggested Recipes
        </Link>

        {session?.user ? (
          <Link
            href="/dashboard/my-recipes"
            className="rounded-lg px-3 py-2.5 text-sm font-semibold text-orange-50 transition hover:bg-orange-700"
          >
            My Recipes
          </Link>
        ) : null}
      </nav>

      <div className="mt-6 border-t border-orange-500 pt-4">
        {session?.user ? (
          <>
            <p className="px-3 text-sm font-semibold text-white">
              {userName || "Signed in"}
            </p>

            {session.user.email ? (
              <p className="mt-1 truncate px-3 text-xs text-orange-100">
                {session.user.email}
              </p>
            ) : null}

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
              className="mt-3"
            >
              <button
                type="submit"
                className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-orange-50 transition hover:bg-orange-700"
              >
                Log out
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/login"
            className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-orange-50 transition hover:bg-orange-700"
          >
            Log in
          </Link>
        )}
      </div>
    </aside>
  );
}