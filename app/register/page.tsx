"use client";

import { FormEvent, ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Cpu,
  Activity,
  Zap,
} from "lucide-react";

import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Нэрээ оруулна уу.");
      return;
    }
    if (!email.trim()) {
      setError("И-мэйл хаягаа оруулна уу.");
      return;
    }
    if (!phone.trim()) {
      setError("Утасны дугаараа оруулна уу.");
      return;
    }
    if (password.length < 8) {
      setError("Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Нууц үг таарахгүй байна.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create the Better Auth account.
      const result = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.error) {
        console.error("[Register] Better Auth error:", result.error);
        setError(result.error.message || "Бүртгэл үүсгэх боломжгүй байна.");
        return;
      }

      // Step 2: Save additional profile information.
      const profileResponse = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          company: company.trim(),
        }),
      });

      let profileResult: { success?: boolean; error?: string } | null = null;
      try {
        profileResult = await profileResponse.json();
      } catch {
        profileResult = null;
      }

      if (!profileResponse.ok || !profileResult?.success) {
        console.error("[Register] Profile update failed:", profileResult);
        console.warn(
          "[Register] Account created, but profile fields could not be saved."
        );
      }

      // Step 3: Continue to the dashboard.
      window.location.href = "/dashboard";
    } catch (submitError) {
      console.error("[Register] Error:", submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Бүртгэл үүсгэх боломжгүй байна. Дахин оролдоно уу."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050B16] text-white">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_18%,rgba(14,165,233,0.16),transparent_42%),radial-gradient(ellipse_at_85%_82%,rgba(37,99,235,0.15),transparent_43%),linear-gradient(135deg,#050B16_0%,#0A1629_52%,#050B16_100%)]" />
        <div className="absolute -left-44 -top-44 h-[560px] w-[560px] rounded-full bg-cyan-500/[0.09] blur-[150px]" />
        <div className="absolute -bottom-44 -right-36 h-[560px] w-[560px] rounded-full bg-blue-600/[0.12] blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.5) 1px,transparent 1px)",
            backgroundSize: "54px 54px",
            maskImage: "radial-gradient(ellipse at center,black,transparent 86%)",
            WebkitMaskImage: "radial-gradient(ellipse at center,black,transparent 86%)",
          }}
        />
        <div className="absolute left-[14%] top-[22%] h-2 w-2 rounded-full bg-cyan-300/70 shadow-[0_0_22px_rgba(103,232,249,.9)] animate-pulse" />
        <div className="absolute right-[17%] top-[30%] h-1.5 w-1.5 rounded-full bg-blue-300/70 shadow-[0_0_20px_rgba(147,197,253,.9)] animate-pulse" />
        <div className="absolute bottom-[18%] left-[28%] h-1.5 w-1.5 rounded-full bg-cyan-300/70 shadow-[0_0_20px_rgba(103,232,249,.9)] animate-pulse" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1450px] items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
        <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Brand / information panel */}
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
                <span className="text-xs font-semibold tracking-[0.15em] text-cyan-200">
                  УХААЛАГ БАРИЛГЫН СИСТЕМ
                </span>
              </div>

              <h1 className="text-5xl font-black leading-[1.12] tracking-tight xl:text-6xl">
                Ухаалаг орчноо
                <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                  өнөөдрөөс эхлүүл.
                </span>
              </h1>

              <p className="mt-7 max-w-md text-base leading-8 text-slate-400">
                MOSFET платформд бүртгүүлж, барилгын автоматжуулалт болон
                тоног төхөөрөмжийн хяналтаа нэг дороос удирдаарай.
              </p>
            </div>

            <div className="relative mt-14 overflow-hidden rounded-[28px] border border-white/[0.10] bg-white/[0.045] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-400/[0.08] blur-[80px]" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                      НЭГДСЭН УДИРДЛАГА
                    </p>
                    <h3 className="mt-2 text-lg font-bold">MOSFET Platform</h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                    <Cpu className="h-6 w-6 text-cyan-300" />
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                    <Activity className="mb-3 h-5 w-5 text-cyan-400" />
                    <p className="text-xs text-slate-500">Бодит цагийн хяналт</p>
                    <p className="mt-1 text-lg font-bold text-white">24/7</p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                    <Zap className="mb-3 h-5 w-5 text-blue-400" />
                    <p className="text-xs text-slate-500">Ухаалаг удирдлага</p>
                    <p className="mt-1 text-lg font-bold text-white">Smart Control</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-white/[0.08] pt-5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
                    <Check className="h-4 w-4 text-emerald-300" />
                  </div>
                  <span className="text-xs text-slate-400">
                    Нэгдсэн платформд тавтай морилно уу
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Registration panel */}
          <section className="mx-auto w-full max-w-[560px]">
            <div className="mb-7 flex items-center justify-between">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-300"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Нүүр хуудас руу буцах
              </Link>
              <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-slate-500 sm:inline-flex">
                MOSFET PLATFORM
              </span>
            </div>

            <div className="mb-7 text-center lg:hidden">
              <Link href="/" className="inline-flex">
                <Image
                  src="/logo.svg"
                  alt="MOSFET"
                  width={220}
                  height={60}
                  priority
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-[30px] border border-white/[0.12] bg-white/[0.055] p-6 shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur-[35px] sm:p-9">
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
              <div className="pointer-events-none absolute -right-28 -top-28 h-64 w-64 rounded-full bg-cyan-400/[0.08] blur-[90px]" />
              <div className="pointer-events-none absolute -bottom-32 -left-28 h-64 w-64 rounded-full bg-blue-500/[0.07] blur-[90px]" />

              <div className="relative">
                <div className="mb-8">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/20 to-blue-500/10 shadow-[0_0_35px_rgba(34,211,238,0.12)]">
                    <ShieldCheck className="h-7 w-7 text-cyan-300" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-white">
                    Бүртгэл үүсгэх
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Мэдээллээ бөглөж MOSFET платформд нэгдээрэй.
                  </p>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 backdrop-blur-xl"
                  >
                    <p className="text-sm leading-6 text-red-300">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <GlassField
                    id="name"
                    label="Овог, нэр"
                    icon={<User className="h-4 w-4" />}
                    value={name}
                    onChange={setName}
                    placeholder="Таны нэр"
                    disabled={loading}
                    autoComplete="name"
                    required
                  />

                  <GlassField
                    id="email"
                    label="И-мэйл хаяг"
                    icon={<Mail className="h-4 w-4" />}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="name@example.com"
                    disabled={loading}
                    autoComplete="email"
                    required
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <GlassField
                      id="phone"
                      label="Утасны дугаар"
                      icon={<Phone className="h-4 w-4" />}
                      type="tel"
                      value={phone}
                      onChange={setPhone}
                      placeholder="+976 99112233"
                      disabled={loading}
                      autoComplete="tel"
                      required
                    />
                    <GlassField
                      id="company"
                      label="Байгууллага"
                      icon={<Building2 className="h-4 w-4" />}
                      value={company}
                      onChange={setCompany}
                      placeholder="Байгууллагын нэр"
                      disabled={loading}
                      autoComplete="organization"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <GlassField
                      id="password"
                      label="Нууц үг"
                      icon={<Lock className="h-4 w-4" />}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={setPassword}
                      placeholder="8-аас дээш тэмдэгт"
                      disabled={loading}
                      autoComplete="new-password"
                      required
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          aria-label={showPassword ? "Нууц үг нуух" : "Нууц үг харах"}
                          className="rounded-lg p-1 text-slate-500 transition hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      }
                    />
                    <GlassField
                      id="confirm-password"
                      label="Нууц үг баталгаажуулах"
                      icon={<Lock className="h-4 w-4" />}
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      placeholder="Нууц үгээ давтана уу"
                      disabled={loading}
                      autoComplete="new-password"
                      required
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((value) => !value)}
                          aria-label={
                            showConfirmPassword ? "Нууц үг нуух" : "Нууц үг харах"
                          }
                          className="rounded-lg p-1 text-slate-500 transition hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      }
                    />
                  </div>

                  <div className="flex items-start gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/70" />
                    <p className="text-xs leading-5 text-slate-400">
                      Нууц үг хамгийн багадаа 8 тэмдэгт байх шаардлагатай.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative mt-2 flex min-h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-5 py-4 text-sm font-bold text-white shadow-[0_8px_35px_rgba(14,165,233,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_45px_rgba(14,165,233,0.38)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Бүртгэл үүсгэж байна...
                      </>
                    ) : (
                      <>
                        Бүртгэл үүсгэх
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 border-t border-white/[0.08] pt-7 text-center">
                  <p className="text-sm text-slate-400">Бүртгэлтэй юу?</p>
                  <Link
                    href="/login"
                    className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition hover:text-cyan-200"
                  >
                    Нэвтрэх
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-center gap-3 text-center">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-600">
                MOSFET SMART BUILDING PLATFORM
              </p>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function GlassField({
  id,
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  autoComplete,
  required,
  trailing,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  required?: boolean;
  trailing?: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="group relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-cyan-300">
          {icon}
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          required={required}
          className="w-full rounded-2xl border border-white/[0.10] bg-black/20 py-3.5 pl-11 pr-11 text-sm text-white outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-400/60 focus:bg-cyan-400/[0.04] focus:ring-4 focus:ring-cyan-400/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
        />
        {trailing && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>
    </div>
  );
}
