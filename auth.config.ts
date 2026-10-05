import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },

callbacks: {
  authorized({ auth, request: { nextUrl } }) {
    const isLoggedIn = Boolean(auth?.user);

    const isMyRecipesRoute =
      nextUrl.pathname.startsWith("/dashboard/my-recipes");

    if (isMyRecipesRoute) {
      return isLoggedIn;
    }

    return true;
  },
},

  providers: [],
} satisfies NextAuthConfig;