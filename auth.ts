import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import postgres from "postgres";
import { z } from "zod";
import { authConfig } from "./auth.config";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    ...authConfig.callbacks,

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string | null;
      }

      return session;
    },
  },

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const email = parsedCredentials.data.email.toLowerCase();
        const password = parsedCredentials.data.password;

        const users = await sql<{
          id: string;
          name: string;
          email: string;
          password: string;
        }[]>`
          SELECT id, name, email, password
          FROM users
          WHERE email = ${email}
          LIMIT 1;
        `;

        const user = users[0];

        if (!user) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          user.password,
        );

        if (!passwordsMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
});