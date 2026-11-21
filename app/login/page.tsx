"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  ArrowLeft,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Cpu,
  Activity,
  Zap,
} from "lucide-react";

import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("И-мэйл хаягаа оруулна уу.");
      return;
    }

    if (!password) {
      setError("Нууц үгээ оруулна уу.");
      return;
    }

    try {
      setLoading(true);

      const result = await signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        setError(
          result.error.message ||
            "И-мэйл эсвэл нууц үг буруу байна."
        );
        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("[Login] Error:", error);

      setError(
        "Нэвтрэх боломжгүй байна. Дахин оролдоно уу."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050B16] text-white">

      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(14,165,233,0.15),transparent_45%),radial-gradient(ellipse_at_80%_80%,rgba(59,130,246,0.13),transparent_45%),linear-gradient(135deg,#050B16,#0A1629,#050B16)]" />

        <div className="absolute -left-40 -top-40 h-[550px] w-[550px] rounded-full bg-cyan-500/[0.10] blur-[150px]" />

        <div className="absolute -right-40 bottom-0 h-[550px] w-[550px] rounded-full bg-blue-600/[0.12] blur-[150px]" />

        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/[0.04] blur-[120px]" />

        {/* Technical grid */}

        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "55px 55px",
            maskImage:
              "radial-gradient(ellipse at center, black, transparent 85%)",
          }}
        />

        {/* Floating particles */}

        <div className="absolute left-[15%] top-[20%] h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_25px_#22d3ee]" />

        <div className="absolute right-[20%] top-[30%] h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400 shadow-[0_0_25px_#60a5fa]" />

        <div className="absolute bottom-[20%] left-[30%] h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_20px_#67e8f9]" />

      </div>

      {/* MAIN CONTENT */}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1450px] items-center justify-center px-4 py-10 sm:px-8 lg:px-12">

        <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* LEFT BRAND SECTION */}

          <section className="hidden lg:block">

            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo.svg"
                alt="MOSFET"
                width={230}
                height={65}
                priority
                className="h-14 w-auto"
              />
            </Link>

            <div className="mt-16 max-w-lg">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 backdrop-blur-xl">

                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

                <span className="text-xs font-semibold tracking-[0.15em] text-cyan-300">
                  УХААЛАГ БАРИЛГЫН СИСТЕМ
                </span>

              </div>

              <h1 className="text-5xl font-black leading-[1.15] tracking-tight xl:text-6xl">

                Ирээдүйн

                <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                  Ухаалаг орчин.
                </span>

              </h1>

              <p className="mt-7 max-w-md text-base leading-8 text-slate-400">
                Барилгын автоматжуулалт, тоног төхөөрөмж,
                температур болон орчны хяналтыг нэг
                платформоос удирдаарай.
              </p>

            </div>

            {/* GLASS FEATURE CARD */}

            <div className="relative mt-14 overflow-hidden rounded-[28px] border border-white/[0.10] bg-white/[0.045] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur-2xl">

              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-400/[0.08] blur-[80px]" />

              <div className="relative">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                      СИСТЕМИЙН ХЯНАЛТ
                    </p>

                    <h3 className="mt-2 text-lg font-bold">
                      MOSFET Platform
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                    <Cpu className="h-6 w-6 text-cyan-300" />
                  </div>

                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">

                  <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">

                    <Activity className="mb-3 h-5 w-5 text-cyan-400" />

                    <p className="text-xs text-slate-500">
                      Системийн ажиллагаа
                    </p>

                    <p className="mt-1 text-lg font-bold text-emerald-400">
                      Идэвхтэй
                    </p>

                  </div>

                  <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">

                    <Zap className="mb-3 h-5 w-5 text-blue-400" />

                    <p className="text-xs text-slate-500">
                      Хяналтын систем
                    </p>

                    <p className="mt-1 text-lg font-bold text-white">
                      Smart Control
                    </p>

                  </div>

                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-white/[0.08] pt-5">

                  <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />

                  <span className="text-xs text-slate-400">
                    Ухаалаг барилгын нэгдсэн платформ
                  </span>

                </div>

              </div>

            </div>

          </section>

          {/* RIGHT LOGIN SECTION */}

          <section className="mx-auto w-full max-w-[470px]">

            {/* MOBILE LOGO */}

            <div className="mb-8 text-center lg:hidden">

              <Link href="/">
                <Image
                  src="/logo.svg"
                  alt="MOSFET"
                  width={220}
                  height={60}
                  priority
                  className="mx-auto h-12 w-auto"
                />
              </Link>

            </div>

            {/* BACK BUTTON */}

            <Link
              href="/"
              className="group mb-7 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-300"
            >

              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
              />

              Нүүр хуудас руу буцах

            </Link>

            {/* LOGIN GLASS CARD */}

            <div className="relative overflow-hidden rounded-[30px] border border-white/[0.12] bg-white/[0.055] p-7 shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur-[35px] sm:p-10">

              {/* TOP LIGHT */}

              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />

              {/* CARD GLOW */}

              <div className="pointer-events-none absolute -right-28 -top-28 h-64 w-64 rounded-full bg-cyan-400/[0.08] blur-[90px]" />

              <div className="relative">

                {/* HEADER */}

                <div className="mb-8">

                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/20 to-blue-500/10 shadow-[0_0_35px_rgba(34,211,238,0.12)]">

                    <ShieldCheck className="h-7 w-7 text-cyan-300" />

                  </div>

                  <h2 className="text-3xl font-black tracking-tight text-white">
                    Тавтай морилно уу
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Өөрийн ухаалаг барилгын хяналтын
                    самбарт нэвтэрнэ үү.
                  </p>

                </div>

                {/* ERROR */}

                {error && (
                  <div
                    role="alert"
                    className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 backdrop-blur-xl"
                  >
                    <p className="text-sm leading-6 text-red-300">
                      {error}
                    </p>
                  </div>
                )}

                {/* FORM */}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >

                  {/* EMAIL */}

                  <div>

                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      И-мэйл хаяг
                    </label>

                    <div className="group relative">

                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition group-focus-within:text-cyan-300" />

                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        placeholder="name@example.com"
                        disabled={loading}
                        className="w-full rounded-2xl border border-white/[0.10] bg-black/20 py-4 pl-12 pr-4 text-sm text-white outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-400/60 focus:bg-cyan-400/[0.04] focus:ring-4 focus:ring-cyan-400/[0.08] disabled:opacity-50"
                      />

                    </div>

                  </div>

                  {/* PASSWORD */}

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <label
                        htmlFor="password"
                        className="text-sm font-medium text-slate-300"
                      >
                        Нууц үг
                      </label>

                    </div>

                    <div className="group relative">

                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition group-focus-within:text-cyan-300" />

                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        placeholder="Нууц үгээ оруулна уу"
                        disabled={loading}
                        className="w-full rounded-2xl border border-white/[0.10] bg-black/20 py-4 pl-12 pr-12 text-sm text-white outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-400/60 focus:bg-cyan-400/[0.04] focus:ring-4 focus:ring-cyan-400/[0.08] disabled:opacity-50"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        aria-label={
                          showPassword
                            ? "Нууц үг нуух"
                            : "Нууц үг харах"
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-cyan-300"
                      >

                        {showPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}

                      </button>

                    </div>

                  </div>

                  {/* SUBMIT BUTTON */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative mt-3 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-5 py-4 text-sm font-bold text-white shadow-[0_8px_35px_rgba(14,165,233,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_45px_rgba(14,165,233,0.38)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >

                    <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />

                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Нэвтэрч байна...
                      </>
                    ) : (
                      <>
                        Нэвтрэх
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}

                  </button>

                </form>

                {/* REGISTER */}

                <div className="mt-8 border-t border-white/[0.08] pt-7 text-center">

                  <p className="text-sm text-slate-400">
                    Бүртгэлгүй байна уу?
                  </p>

                  <Link
                    href="/register"
                    className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition hover:text-cyan-200"
                  >
                    Шинээр бүртгүүлэх
                    <ArrowRight size={15} />
                  </Link>

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="mt-7 flex items-center justify-center gap-2 text-center">

              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />

              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-600">
                MOSFET SMART BUILDING PLATFORM
              </p>

              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />

            </div>

          </section>

        </div>

      </div>

      {/* ANIMATIONS */}

      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-12px);
            }
          }
        }
      `}</style>

    </main>
  );
}