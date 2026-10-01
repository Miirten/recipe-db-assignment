import Link from 'next/link';
import SignupForm from '@/app/ui/signup-form';

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          ← Back to RecipeBook
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            Get started
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
            Create your account
          </h1>

          <p className="mt-3 text-sm leading-6 text-stone-600">
            Save recipes and build your own collection.
          </p>
        </div>

        <SignupForm />

        <p className="mt-6 text-center text-sm text-stone-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}