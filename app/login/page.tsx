"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    if (!email.trim()) {
      setError(
        "Please enter your email."
      );
      return;
    }

    if (!password) {
      setError(
        "Please enter your password."
      );
      return;
    }

    try {
      setLoading(true);

      const result =
        await signIn.email({
          email: email.trim(),
          password,
        });

      if (result.error) {
        setError(
          result.error.message ||
            "Invalid email or password."
        );

        return;
      }

      window.location.href =
        "/dashboard";
    } catch (error) {
      console.error(
        "[Login] Error:",
        error
      );

      setError(
        "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        {/* LOGO / HEADER */}

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <h1 className="text-3xl font-bold">
            MOSFET
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Smart Building Monitoring Platform
          </p>
        </div>

        {/* LOGIN CARD */}

        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Sign in
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to access your dashboard.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
              <p className="text-sm text-destructive">
                {error}
              </p>
            </div>
          )}

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-5"
          >
            {/* EMAIL */}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium"
              >
                Email
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(
                    event
                  ) =>
                    setEmail(
                      event.target
                        .value
                    )
                  }
                  placeholder="you@example.com"
                  disabled={loading}
                  className="w-full rounded-md border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium"
              >
                Password
              </label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(
                    event
                  ) =>
                    setPassword(
                      event.target
                        .value
                    )
                  }
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full rounded-md border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* REGISTER */}

          <div className="mt-6 border-t pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?
            </p>

            <a
              href="/register"
              className="mt-1 inline-block text-sm font-medium text-primary hover:underline"
            >
              Create an account
            </a>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          MOSFET Smart Building Platform
        </p>
      </div>
    </main>
  );
}