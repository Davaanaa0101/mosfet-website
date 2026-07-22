import { Cpu, ShieldCheck, Zap } from "lucide-react";
import { t } from "@/lib/i18n";

const icons = [Zap, Cpu, ShieldCheck];

export default function About() {
  return (
    <section
      id="about"
      className="bg-card py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* Left */}

          <div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              {t.about.badge}
            </p>

            <h2 className="text-4xl font-bold text-foreground">
              {t.about.title}
            </h2>

            <p className="mt-8 text-lg leading-8 text-muted-foreground">
              {t.about.description1}
            </p>

            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {t.about.description2}
            </p>

          </div>

          {/* Right */}

          <div className="grid gap-6">

            {t.about.features.map((feature, index) => {
              const Icon = icons[index];

              return (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10"
                >
                  <Icon
                    size={36}
                    className="mb-4 text-primary"
                  />

                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>

                  <p className="mt-2 leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
}