"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import Image from "next/image";

import {
  ArrowLeft,
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
            bottom-[0]
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
            h-[450px]
            w-[450px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-blue-500/[0.05]
            blur-[100px]
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

        {/* Horizontal technical line */}

        <div
          className="
            absolute
            left-0
            right-0
            top-[20%]
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
            bottom-[20%]
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#E91E63]/15
            to-transparent
          "
        />

        {/* Vertical technical line */}

        <div
          className="
            absolute
            bottom-0
            left-[18%]
            top-0
            hidden
            w-px
            bg-gradient-to-b
            from-transparent
            via-blue-400/10
            to-transparent
            lg:block
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-[18%]
            top-0
            hidden
            w-px
            bg-gradient-to-b
            from-transparent
            via-[#E91E63]/10
            to-transparent
            lg:block
          "
        />

        {/* Technical nodes */}

        <div
          className="
            absolute
            left-[18%]
            top-[20%]
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
            right-[18%]
            bottom-[20%]
            h-2
            w-2
            rounded-full
            bg-[#E91E63]/60
            shadow-[0_0_20px_rgba(233,30,99,0.7)]
          "
        />
      </div>

      {/* ================================================= */}
      {/* PAGE CONTENT */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
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
        {/* LOGO / HEADER */}
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
            Welcome back
          </h1>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-400
            "
          >
            Sign in to access your
            smart building dashboard.
          </p>
        </div>

        {/* ================================================= */}
        {/* LOGIN CARD */}
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
            {/* Header */}

            <div className="mb-7">
              <h2
                className="
                  text-xl
                  font-bold
                  text-white
                "
              >
                Sign in
              </h2>

              <p
                className="
                  mt-1.5
                  text-sm
                  text-slate-400
                "
              >
                Enter your account
                credentials below.
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
                space-y-5
              "
            >
              {/* EMAIL */}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="
                    block
                    text-sm
                    font-medium
                    text-slate-300
                  "
                >
                  Email
                </label>

                <div className="relative">
                  <Mail
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      h-4
                      w-4
                      -translate-y-1/2
                      text-slate-500
                    "
                  />

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
                    disabled={
                      loading
                    }
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

              {/* PASSWORD */}

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="
                    block
                    text-sm
                    font-medium
                    text-slate-300
                  "
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      h-4
                      w-4
                      -translate-y-1/2
                      text-slate-500
                    "
                  />

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
                    disabled={
                      loading
                    }
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

              {/* SUBMIT */}

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

                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* ================================================= */}
            {/* REGISTER */}
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
                Don't have an account?
              </p>

              <Link
                href="/register"
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
                Create an account

                <ArrowLeft
                  size={14}
                  className="
                    rotate-180
                  "
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