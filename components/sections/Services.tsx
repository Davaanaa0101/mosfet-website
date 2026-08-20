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
      className="
        relative
        overflow-hidden
        bg-[#07111F]
        py-24
        text-white
        lg:py-32
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
            bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.10),transparent_45%),linear-gradient(180deg,#07111F_0%,#081321_100%)]
          "
        />

        {/* Pink glow */}

        <div
          className="
            absolute
            -left-[250px]
            top-[15%]
            h-[550px]
            w-[550px]
            rounded-full
            bg-[#E91E63]/[0.06]
            blur-[140px]
          "
        />

        {/* Blue glow */}

        <div
          className="
            absolute
            -right-[250px]
            top-[35%]
            h-[600px]
            w-[600px]
            rounded-full
            bg-blue-500/[0.08]
            blur-[150px]
          "
        />

        {/* Technical grid */}

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
              "radial-gradient(ellipse 90% 80% at 50% 50%, black, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 80% at 50% 50%, black, transparent 90%)",
          }}
        />

        {/* Technical dots */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.18]
          "
          style={{
            backgroundImage:
              "radial-gradient(rgba(96,165,250,0.45) 1px, transparent 1px)",
            backgroundSize:
              "32px 32px",
            maskImage:
              "radial-gradient(ellipse 70% 80% at 50% 40%, black, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 80% at 50% 40%, black, transparent 85%)",
          }}
        />

        {/* Top line */}

        <div
          className="
            absolute
            inset-x-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#E91E63]/40
            to-transparent
          "
        />

        {/* Bottom line */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-blue-400/20
            to-transparent
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
          mx-auto
          max-w-7xl
          px-6
          sm:px-8
          lg:px-10
        "
      >
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div
          className="
            mx-auto
            mb-16
            max-w-3xl
            text-center
            lg:mb-20
          "
        >
          {/* Badge */}

          <div className="mb-6">
            <div
              className="
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-[#E91E63]/25
                bg-[#E91E63]/[0.05]
                px-4
                py-2
                backdrop-blur-md
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-[#E91E63]
                  shadow-[0_0_14px_rgba(233,30,99,0.7)]
                "
              />

              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.3em]
                  text-[#F4729B]
                  sm:text-xs
                "
              >
                {t.services.badge}
              </p>
            </div>
          </div>

          {/* Title */}

          <h2
            className="
              text-4xl
              font-black
              leading-[1.05]
              tracking-[-0.035em]
              text-white
              sm:text-5xl
              lg:text-6xl
            "
          >
            {t.services.title}
          </h2>

          {/* Accent */}

          <div
            className="
              mx-auto
              mt-7
              h-1
              w-16
              rounded-full
              bg-[#E91E63]
              shadow-[0_0_20px_rgba(233,30,99,0.3)]
            "
          />

          {/* Description */}

          <p
            className="
              mx-auto
              mt-7
              max-w-2xl
              text-base
              leading-8
              text-slate-400
              sm:text-lg
            "
          >
            {t.services.description}
          </p>
        </div>

        {/* ================================================= */}
        {/* SERVICE CARDS */}
        {/* ================================================= */}

        <div
          className="
            grid
            gap-5
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          {t.services.items.map(
            (service, index) => {
              const Icon =
                icons[
                  service.icon as keyof typeof icons
                ] ?? Cpu;

              return (
                <div
                  key={
                    service.title
                  }
                  className="
                    group
                    relative
                    flex
                    min-h-[390px]
                    flex-col
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/[0.035]
                    p-7
                    backdrop-blur-md
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    hover:border-[#E91E63]/40
                    hover:bg-white/[0.055]
                    hover:shadow-[0_25px_80px_rgba(0,0,0,0.3)]
                    sm:p-8
                  "
                >
                  {/* Card glow */}

                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      -right-20
                      -top-20
                      h-48
                      w-48
                      rounded-full
                      bg-[#E91E63]/0
                      blur-[80px]
                      transition-all
                      duration-500
                      group-hover:bg-[#E91E63]/15
                    "
                  />

                  {/* Card number */}

                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      right-5
                      top-1
                      text-[100px]
                      font-black
                      leading-none
                      text-white/[0.025]
                      transition-all
                      duration-500
                      group-hover:text-[#E91E63]/[0.06]
                    "
                  >
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  {/* Top line */}

                  <div
                    className="
                      absolute
                      left-0
                      top-0
                      h-0.5
                      w-0
                      bg-gradient-to-r
                      from-[#E91E63]
                      to-blue-400
                      transition-all
                      duration-500
                      group-hover:w-full
                    "
                  />

                  {/* Icon */}

                  <div
                    className="
                      relative
                      z-10
                      flex
                      h-16
                      w-16
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-[#E91E63]/20
                      bg-[#E91E63]/[0.07]
                      transition-all
                      duration-500
                      group-hover:rotate-3
                      group-hover:border-[#E91E63]/40
                      group-hover:bg-[#E91E63]/15
                      group-hover:shadow-[0_0_30px_rgba(233,30,99,0.12)]
                    "
                  >
                    <Icon
                      size={30}
                      strokeWidth={1.7}
                      className="
                        text-[#F0447D]
                        transition-all
                        duration-300
                        group-hover:scale-110
                      "
                    />
                  </div>

                  {/* Title */}

                  <h3
                    className="
                      relative
                      z-10
                      mt-7
                      text-xl
                      font-bold
                      leading-snug
                      text-white
                      sm:text-2xl
                    "
                  >
                    {
                      service.title
                    }
                  </h3>

                  {/* Features */}

                  <ul
                    className="
                      relative
                      z-10
                      mt-6
                      flex-1
                      space-y-3
                    "
                  >
                    {service.features.map(
                      (
                        feature
                      ) => (
                        <li
                          key={
                            feature
                          }
                          className="
                            flex
                            items-start
                            gap-3
                            text-sm
                            leading-6
                            text-slate-400
                            transition-colors
                            duration-300
                            group-hover:text-slate-300
                          "
                        >
                          <span
                            className="
                              mt-1
                              flex
                              h-4
                              w-4
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-[#E91E63]/10
                            "
                          >
                            <Check
                              size={10}
                              strokeWidth={
                                3
                              }
                              className="
                                text-[#E91E63]
                              "
                            />
                          </span>

                          <span>
                            {
                              feature
                            }
                          </span>
                        </li>
                      )
                    )}
                  </ul>

                  {/* Footer */}

                  <div
                    className="
                      relative
                      z-10
                      mt-8
                      border-t
                      border-white/10
                      pt-5
                    "
                  >
                    <button
                      type="button"
                      className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-[#F0447D]
                        transition-all
                        duration-300
                        group-hover:gap-4
                      "
                    >
                      {t.services.learnMore}

                      <ArrowRight
                        size={17}
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      />
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* ================================================= */}
        {/* BOTTOM TECHNICAL LABEL */}
        {/* ================================================= */}

        <div
          className="
            mt-14
            flex
            items-center
            justify-center
            gap-4
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.28em]
            text-slate-600
          "
        >
          <span
            className="
              h-px
              w-12
              bg-slate-700
            "
          />

          <span>
            ENGINEERING
          </span>

          <span className="text-[#E91E63]">
            •
          </span>

          <span>
            AUTOMATION
          </span>

          <span className="text-[#E91E63]">
            •
          </span>

          <span>
            CONTROL
          </span>

          <span
            className="
              h-px
              w-12
              bg-slate-700
            "
          />
        </div>
      </div>
    </section>
  );
}