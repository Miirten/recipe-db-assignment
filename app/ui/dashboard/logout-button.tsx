import { signOut } from "@/auth";

export default function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <button
        type="submit"
        className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-stone-700 transition-colors hover:bg-orange-50 hover:text-orange-700"
      >
        Log out
      </button>
    </form>
  );
}