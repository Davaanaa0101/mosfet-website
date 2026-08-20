"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import Image from "next/image";

import {
  ArrowLeft,
  ArrowUpRight,
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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

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
      // =================================================

      const result =
        await signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
        });

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

      if (
        !profileResponse.ok ||
        !profileResult?.success
      ) {
        console.error(
          "[Register] Profile update failed:",
          profileResult
        );

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

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[#07111F]
        px-4
        py-10
        text-white
        sm:px-6
      "
    >
      {/* ================================================= */}
      {/* BACKGROUND */}
      {/* ================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* Base gradient */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_50%_40%,rgba(37,99,235,0.14),transparent_40%),linear-gradient(135deg,#07111F_0%,#0A1628_50%,#050B14_100%)]
          "
        />

        {/* Blue glow */}

        <div
          className="
            absolute
            -left-[220px]
            -top-[200px]
            h-[550px]
            w-[550px]
            rounded-full
            bg-blue-500/[0.08]
            blur-[140px]
          "
        />

        {/* Pink glow */}

        <div
          className="
            absolute
            -right-[180px]
            bottom-0
            h-[500px]
            w-[500px]
            rounded-full
            bg-[#E91E63]/[0.07]
            blur-[130px]
          "
        />

        {/* Center glow */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[500px]
            w-[500px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-blue-500/[0.04]
            blur-[110px]
          "
        />

        {/* Engineering grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.055]
          "
          style={{
            backgroundImage: `
              linear-gradient(
                to right,
                rgba(96,165,250,0.35) 1px,
                transparent 1px
              ),
              linear-gradient(
                to bottom,
                rgba(96,165,250,0.35) 1px,
                transparent 1px
              )
            `,
            backgroundSize:
              "48px 48px",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 90%)",
          }}
        />

        {/* Technical dots */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.2]
          "
          style={{
            backgroundImage:
              "radial-gradient(rgba(96,165,250,0.5) 1px, transparent 1px)",
            backgroundSize:
              "32px 32px",
            maskImage:
              "radial-gradient(ellipse 65% 70% at 50% 50%, black, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 65% 70% at 50% 50%, black, transparent 85%)",
          }}
        />

        {/* Technical lines */}

        <div
          className="
            absolute
            left-0
            right-0
            top-[15%]
            h-px
            bg-gradient-to-r
            from-transparent
            via-blue-400/15
            to-transparent
          "
        />

        <div
          className="
            absolute
            left-0
            right-0
            bottom-[15%]
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#E91E63]/15
            to-transparent
          "
        />

        {/* Nodes */}

        <div
          className="
            absolute
            left-[12%]
            top-[15%]
            h-2
            w-2
            rounded-full
            bg-blue-400/50
            shadow-[0_0_20px_rgba(96,165,250,0.7)]
          "
        />

        <div
          className="
            absolute
            right-[12%]
            bottom-[15%]
            h-2
            w-2
            rounded-full
            bg-[#E91E63]/60
            shadow-[0_0_20px_rgba(233,30,99,0.7)]
          "
        />
      </div>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-lg
        "
      >
        {/* ================================================= */}
        {/* BACK TO HOME */}
        {/* ================================================= */}

        <div className="mb-6">
          <Link
            href="/"
            className="
              group
              inline-flex
              items-center
              gap-2
              text-sm
              text-slate-400
              transition-colors
              hover:text-white
            "
          >
            <ArrowLeft
              size={16}
              className="
                transition-transform
                duration-300
                group-hover:-translate-x-1
              "
            />

            Back to website
          </Link>
        </div>

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-7 text-center">
          <Link
            href="/"
            className="
              inline-flex
              items-center
              justify-center
            "
          >
            <Image
              src="/logo.svg"
              alt="MOSFET"
              width={220}
              height={60}
              priority
              className="
                h-12
                w-auto
              "
            />
          </Link>

          <div
            className="
              mx-auto
              mt-6
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              border
              border-[#E91E63]/25
              bg-[#E91E63]/10
              shadow-[0_0_30px_rgba(233,30,99,0.08)]
            "
          >
            <ShieldCheck
              className="
                h-6
                w-6
                text-[#F0447D]
              "
            />
          </div>

          <h1
            className="
              mt-5
              text-2xl
              font-black
              tracking-tight
              text-white
            "
          >
            Create your account
          </h1>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-400
            "
          >
            Start monitoring your
            smart building with MOSFET.
          </p>
        </div>

        {/* ================================================= */}
        {/* REGISTER CARD */}
        {/* ================================================= */}

        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-white/[0.045]
            p-6
            shadow-[0_30px_100px_rgba(0,0,0,0.35)]
            backdrop-blur-2xl
            sm:p-8
          "
        >
          {/* Top accent */}

          <div
            className="
              absolute
              left-0
              right-0
              top-0
              h-0.5
              bg-gradient-to-r
              from-transparent
              via-[#E91E63]
              to-transparent
            "
          />

          {/* Card glow */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-48
              w-48
              rounded-full
              bg-[#E91E63]/[0.06]
              blur-[70px]
            "
          />

          <div className="relative">
            {/* Card heading */}

            <div className="mb-7">
              <h2
                className="
                  text-xl
                  font-bold
                  text-white
                "
              >
                Create account
              </h2>

              <p
                className="
                  mt-1.5
                  text-sm
                  text-slate-400
                "
              >
                Enter your information
                to get started.
              </p>
            </div>

            {/* ================================================= */}
            {/* ERROR */}
            {/* ================================================= */}

            {error && (
              <div
                className="
                  mb-5
                  rounded-xl
                  border
                  border-red-400/20
                  bg-red-400/10
                  px-4
                  py-3
                "
              >
                <p
                  className="
                    text-sm
                    leading-6
                    text-red-300
                  "
                >
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
              className="
                space-y-4
              "
            >
              <Field
                id="name"
                label="Full Name"
                icon={
                  <User className="h-4 w-4" />
                }
                value={name}
                onChange={setName}
                placeholder="Your name"
                disabled={loading}
                autoComplete="name"
              />

              <Field
                id="email"
                label="Email"
                icon={
                  <Mail className="h-4 w-4" />
                }
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                disabled={loading}
                autoComplete="email"
              />

              <Field
                id="phone"
                label="Phone"
                icon={
                  <Phone className="h-4 w-4" />
                }
                type="tel"
                value={phone}
                onChange={setPhone}
                placeholder="+976 99112233"
                disabled={loading}
                autoComplete="tel"
              />

              <Field
                id="company"
                label="Company"
                icon={
                  <Building2 className="h-4 w-4" />
                }
                value={company}
                onChange={setCompany}
                placeholder="Company name"
                disabled={loading}
                autoComplete="organization"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="password"
                  label="Password"
                  icon={
                    <Lock className="h-4 w-4" />
                  }
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Minimum 8 characters"
                  disabled={loading}
                  autoComplete="new-password"
                />

                <Field
                  id="confirm-password"
                  label="Confirm Password"
                  icon={
                    <Lock className="h-4 w-4" />
                  }
                  type="password"
                  value={confirmPassword}
                  onChange={
                    setConfirmPassword
                  }
                  placeholder="Repeat password"
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>

              {/* Password hint */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/5
                  bg-white/[0.025]
                  px-3
                  py-2.5
                "
              >
                <Lock
                  size={13}
                  className="text-slate-600"
                />

                <p
                  className="
                    text-[11px]
                    leading-5
                    text-slate-500
                  "
                >
                  Use at least 8 characters
                  for your password.
                </p>
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="
                  mt-2
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#E91E63]
                  px-4
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_0_25px_rgba(233,30,99,0.12)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#D81B60]
                  hover:shadow-[0_0_35px_rgba(233,30,99,0.25)]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  disabled:hover:translate-y-0
                "
              >
                {loading ? (
                  <>
                    <Loader2
                      className="
                        h-4
                        w-4
                        animate-spin
                      "
                    />

                    Creating account...
                  </>
                ) : (
                  <>
                    Create account

                    <ArrowUpRight
                      size={17}
                    />
                  </>
                )}
              </button>
            </form>

            {/* ================================================= */}
            {/* LOGIN */}
            {/* ================================================= */}

            <div
              className="
                mt-7
                border-t
                border-white/10
                pt-6
                text-center
              "
            >
              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                Already have an account?
              </p>

              <Link
                href="/login"
                className="
                  mt-1.5
                  inline-flex
                  items-center
                  gap-1
                  text-sm
                  font-semibold
                  text-[#F0447D]
                  transition-colors
                  hover:text-[#FF6B9A]
                "
              >
                Sign in

                <ArrowUpRight
                  size={14}
                />
              </Link>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div
          className="
            mt-6
            text-center
          "
        >
          <p
            className="
              text-[11px]
              uppercase
              tracking-[0.2em]
              text-slate-600
            "
          >
            MOSFET Smart Building Platform
          </p>
        </div>
      </div>
    </main>
  );
}

/* ================================================= */
/* FIELD */
/* ================================================= */

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
        className="
          block
          text-sm
          font-medium
          text-slate-300
        "
      >
        {label}
      </label>

      <div className="relative">
        <div
          className="
            pointer-events-none
            absolute
            left-3.5
            top-1/2
            -translate-y-1/2
            text-slate-500
          "
        >
          {icon}
        </div>

        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className="
            w-full
            rounded-xl
            border
            border-white/10
            bg-black/20
            py-3
            pl-10
            pr-4
            text-sm
            text-white
            outline-none
            transition-all
            duration-300
            placeholder:text-slate-600
            focus:border-[#E91E63]/60
            focus:bg-black/30
            focus:ring-4
            focus:ring-[#E91E63]/10
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        />
      </div>
    </div>
  );
}