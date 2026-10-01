'use client';

import { useActionState } from "react";
import { registerUser } from "@/app/actions";

export default function SignupForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    registerUser,
    undefined,
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-stone-700"
        >
          Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="mt-2 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-stone-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-stone-700"
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-stone-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-stone-700"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
          className="mt-2 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-stone-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      {errorMessage ? (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-300"
      >
        {isPending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}