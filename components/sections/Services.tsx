import { t } from "@/lib/i18n";
import {
  Zap,
  Cpu,
  ShieldCheck,
  Flame,
  Network,
  Code2,
  Check,
  ArrowRight,
} from "lucide-react";

const icons = {
  zap: Zap,
  cpu: Cpu,
  shield: ShieldCheck,
  flame: Flame,
  network: Network,
  code: Code2,
} as const;

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-background py-32"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(194,24,91,0.08),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}

        <div className="mx-auto mb-20 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
            {t.services.badge}
          </p>

          <h2 className="mt-5 text-5xl font-bold text-foreground">
            {t.services.title}
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {t.services.description}
          </p>
        </div>

        {/* Cards */}

        <div className="grid gap-8 lg:grid-cols-3">
          {t.services.items.map((service) => {
            const Icon = icons[service.icon as keyof typeof icons];

            return (
              <div
                key={service.title}
                className="group flex flex-col rounded-3xl border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-3 hover:border-primary hover:shadow-[0_20px_60px_rgba(194,24,91,.20)]"
              >
                {/* Icon */}

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:rotate-6">
                  <Icon
                    size={30}
                    className="text-primary group-hover:text-white"
                  />
                </div>

                {/* Title */}

                <h3 className="mt-8 text-2xl font-bold text-foreground">
                  {service.title}
                </h3>

                {/* Features */}

                <ul className="mt-6 space-y-3 flex-1">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-muted-foreground"
                    >
                      <Check
                        size={18}
                        className="text-primary"
                      />

                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Footer */}

                <div className="mt-8 border-t border-border pt-6">
                  <button className="flex items-center gap-2 font-semibold text-primary transition-all group-hover:gap-4">
                    {t.services.learnMore}

                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}