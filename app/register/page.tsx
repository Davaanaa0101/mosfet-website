"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Building2,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [company, setCompany] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  // =====================================================
  // SUBMIT
  // =====================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (!name.trim()) {
      setError(
        "Please enter your name."
      );
      return;
    }

    if (!email.trim()) {
      setError(
        "Please enter your email."
      );
      return;
    }

    if (!phone.trim()) {
      setError(
        "Please enter your phone number."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // STEP 1
      // CREATE BETTER AUTH ACCOUNT
      //
      // IMPORTANT:
      // Only use fields supported by the current
      // Better Auth client types.
      // =================================================

      const result =
        await signUp.email({
          name: name.trim(),

          email: email.trim(),

          password,
        });

      // ---------------------------------------------------
      // BETTER AUTH ERROR
      // ---------------------------------------------------

      if (result.error) {
        console.error(
          "[Register] Better Auth error:",
          result.error
        );

        setError(
          result.error.message ||
            "Unable to create account."
        );

        return;
      }

      // =================================================
      // STEP 2
      // SAVE EXTRA PROFILE INFORMATION
      //
      // The successful signUp creates the session.
      // Now /api/profile can identify the logged-in user.
      // =================================================

      const profileResponse =
        await fetch(
          "/api/profile",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            cache: "no-store",

            body: JSON.stringify({
              name:
                name.trim(),

              phone:
                phone.trim(),

              company:
                company.trim(),
            }),
          }
        );

      // ---------------------------------------------------
      // READ RESPONSE SAFELY
      // ---------------------------------------------------

      let profileResult:
        | {
            success?: boolean;
            error?: string;
          }
        | null = null;

      try {
        profileResult =
          await profileResponse.json();
      } catch {
        profileResult = null;
      }

      // ---------------------------------------------------
      // PROFILE ERROR
      // ---------------------------------------------------

      if (
        !profileResponse.ok ||
        !profileResult?.success
      ) {
        console.error(
          "[Register] Profile update failed:",
          profileResult
        );

        /*
         * The Better Auth account has already been created.
         *
         * Do not tell the user that registration failed.
         *
         * We can still send them to the dashboard and
         * fix/update their profile later.
         */

        console.warn(
          "[Register] Account created, but profile fields could not be saved."
        );
      }

      // =================================================
      // STEP 3
      // GO TO DASHBOARD
      // =================================================

      window.location.href =
        "/dashboard";
    } catch (error) {
      console.error(
        "[Register] Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-lg">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <h1 className="text-3xl font-bold">
            MOSFET
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Create your monitoring account
          </p>
        </div>

        {/* ================================================= */}
        {/* CARD */}
        {/* ================================================= */}

        <div className="rounded-xl border bg-background p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Create account
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Enter your information to get started.
            </p>
          </div>

          {/* ================================================= */}
          {/* ERROR */}
          {/* ================================================= */}

          {error && (
            <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
              <p className="text-sm text-destructive">
                {error}
              </p>
            </div>
          )}

          {/* ================================================= */}
          {/* FORM */}
          {/* ================================================= */}

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-5"
          >

            {/* ================================================= */}
            {/* NAME */}
            {/* ================================================= */}

            <Field
              id="name"
              label="Full Name"
              icon={
                <User className="h-4 w-4" />
              }
              value={name}
              onChange={
                setName
              }
              placeholder="Your name"
              disabled={loading}
              autoComplete="name"
            />

            {/* ================================================= */}
            {/* EMAIL */}
            {/* ================================================= */}

            <Field
              id="email"
              label="Email"
              icon={
                <Mail className="h-4 w-4" />
              }
              type="email"
              value={email}
              onChange={
                setEmail
              }
              placeholder="you@example.com"
              disabled={loading}
              autoComplete="email"
            />

            {/* ================================================= */}
            {/* PHONE */}
            {/* ================================================= */}

            <Field
              id="phone"
              label="Phone"
              icon={
                <Phone className="h-4 w-4" />
              }
              type="tel"
              value={phone}
              onChange={
                setPhone
              }
              placeholder="+976 99112233"
              disabled={loading}
              autoComplete="tel"
            />

            {/* ================================================= */}
            {/* COMPANY */}
            {/* ================================================= */}

            <Field
              id="company"
              label="Company"
              icon={
                <Building2 className="h-4 w-4" />
              }
              value={company}
              onChange={
                setCompany
              }
              placeholder="Company name"
              disabled={loading}
              autoComplete="organization"
            />

            {/* ================================================= */}
            {/* PASSWORD */}
            {/* ================================================= */}

            <Field
              id="password"
              label="Password"
              icon={
                <Lock className="h-4 w-4" />
              }
              type="password"
              value={password}
              onChange={
                setPassword
              }
              placeholder="Minimum 8 characters"
              disabled={loading}
              autoComplete="new-password"
            />

            {/* ================================================= */}
            {/* CONFIRM PASSWORD */}
            {/* ================================================= */}

            <Field
              id="confirm-password"
              label="Confirm Password"
              icon={
                <Lock className="h-4 w-4" />
              }
              type="password"
              value={
                confirmPassword
              }
              onChange={
                setConfirmPassword
              }
              placeholder="Repeat your password"
              disabled={loading}
              autoComplete="new-password"
            />

            {/* ================================================= */}
            {/* SUBMIT */}
            {/* ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* ================================================= */}
          {/* LOGIN */}
          {/* ================================================= */}

          <div className="mt-6 border-t pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?
            </p>

            <a
              href="/login"
              className="mt-1 inline-block text-sm font-medium text-primary hover:underline"
            >
              Sign in
            </a>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          MOSFET Smart Building Platform
        </p>
      </div>
    </main>
  );
}

// =====================================================
// FIELD
// =====================================================

function Field({
  id,
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  autoComplete,
}: {
  id: string;

  label: string;

  icon: React.ReactNode;

  type?: string;

  value: string;

  onChange: (
    value: string
  ) => void;

  placeholder?: string;

  disabled?: boolean;

  autoComplete?: string;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium"
      >
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>

        <input
          id={id}
          type={type}
          value={value}
          onChange={(
            event
          ) =>
            onChange(
              event.target.value
            )
          }
          placeholder={
            placeholder
          }
          disabled={disabled}
          autoComplete={
            autoComplete
          }
          className="w-full rounded-md border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
      </div>
    </div>
  );
}