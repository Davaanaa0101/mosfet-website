import Link from "next/link";
import { t } from "@/lib/i18n";
import CircuitGraphic from "@/components/ui/CircuitGraphic";

export default function Hero() {
  return (
    <section
  id="hero"
  className="relative flex min-h-screen items-center overflow-hidden bg-background pt-24"
>
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow */}
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[180px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">

        {/* LEFT SIDE */}

        <div>

          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            {t.hero.badge}
          </p>

          <h1 className="text-5xl font-black leading-tight md:text-7xl">

            <span className="text-foreground">
              {t.hero.title1}
            </span>

            <br />

            <span className="text-primary">
              {t.hero.title2}
            </span>

            <br />

            <span className="text-foreground">
              {t.hero.title3}
            </span>

          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
            {t.hero.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              href="#contact"
              className="rounded-xl bg-primary px-8 py-4 font-semibold text-primary-foreground transition hover:bg-accent"
            >
              {t.hero.primaryButton}
            </Link>

            <Link
              href="#services"
              className="rounded-xl border border-border px-8 py-4 font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              {t.hero.secondaryButton}
            </Link>

          </div>

          {/* Statistics */}

          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">

            {t.hero.stats.map((item) => (
              <div key={item.label}>

                <h3 className="text-4xl font-black text-primary">
                  {item.value}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {item.label}
                </p>

              </div>
            ))}

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="hidden justify-center lg:flex">
          <CircuitGraphic />
        </div>

      </div>
    </section>
  );
}