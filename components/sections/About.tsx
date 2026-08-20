import {
  Cpu,
  ShieldCheck,
  Zap,
  ArrowUpRight,
} from "lucide-react";

import { t } from "@/lib/i18n";

const icons = [
  Zap,
  Cpu,
  ShieldCheck,
];

export default function About() {
  return (
    <section
      id="about"
      className="
        relative
        overflow-hidden
        bg-[#F8FAFC]
        py-24
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
        {/* Soft blue glow */}

        <div
          className="
            absolute
            -left-40
            top-20
            h-[450px]
            w-[450px]
            rounded-full
            bg-blue-500/[0.05]
            blur-[120px]
          "
        />

        {/* Pink glow */}

        <div
          className="
            absolute
            -right-40
            bottom-0
            h-[450px]
            w-[450px]
            rounded-full
            bg-[#E91E63]/[0.04]
            blur-[120px]
          "
        />

        {/* Technical grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
          "
          style={{
            backgroundImage: `
              linear-gradient(
                to right,
                #64748B 1px,
                transparent 1px
              ),
              linear-gradient(
                to bottom,
                #64748B 1px,
                transparent 1px
              )
            `,
            backgroundSize:
              "48px 48px",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)",
          }}
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
        <div
          className="
            grid
            gap-16
            lg:grid-cols-[0.9fr_1.1fr]
            lg:items-center
            lg:gap-20
          "
        >
          {/* ================================================= */}
          {/* LEFT SIDE */}
          {/* ================================================= */}

          <div>
            {/* Badge */}

            <div className="mb-6">
              <div
                className="
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  border
                  border-[#E91E63]/20
                  bg-[#E91E63]/[0.04]
                  px-4
                  py-2
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-[#E91E63]
                    shadow-[0_0_12px_rgba(233,30,99,0.35)]
                  "
                />

                <p
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.25em]
                    text-[#D81B60]
                    sm:text-xs
                  "
                >
                  {t.about.badge}
                </p>
              </div>
            </div>

            {/* Title */}

            <h2
              className="
                max-w-xl
                text-4xl
                font-black
                leading-[1.05]
                tracking-[-0.035em]
                text-slate-950
                sm:text-5xl
                lg:text-6xl
              "
            >
              {t.about.title}
            </h2>

            {/* Accent line */}

            <div
              className="
                mt-7
                h-1
                w-16
                rounded-full
                bg-[#E91E63]
              "
            />

            {/* Description 1 */}

            <p
              className="
                mt-8
                max-w-xl
                text-base
                leading-8
                text-slate-600
                sm:text-lg
              "
            >
              {t.about.description1}
            </p>

            {/* Description 2 */}

            <p
              className="
                mt-5
                max-w-xl
                text-base
                leading-8
                text-slate-600
                sm:text-lg
              "
            >
              {t.about.description2}
            </p>

            {/* Small engineering label */}

            <div
              className="
                mt-9
                flex
                items-center
                gap-3
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
                text-slate-400
              "
            >
              <span
                className="
                  h-px
                  w-10
                  bg-[#E91E63]/50
                "
              />

              Engineering
              •
              Automation
              •
              Technology
            </div>
          </div>

          {/* ================================================= */}
          {/* RIGHT SIDE */}
          {/* ================================================= */}

          <div
            className="
              grid
              gap-5
            "
          >
            {t.about.features.map(
              (feature, index) => {
                const Icon =
                  icons[index] ??
                  Cpu;

                return (
                  <div
                    key={
                      feature.title
                    }
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-3xl
                      border
                      border-slate-200
                      bg-white
                      p-6
                      shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#E91E63]/30
                      hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]
                      sm:p-7
                    "
                  >
                    {/* Card accent */}

                    <div
                      className="
                        absolute
                        left-0
                        top-0
                        h-full
                        w-1
                        origin-left
                        scale-y-0
                        bg-[#E91E63]
                        transition-transform
                        duration-300
                        group-hover:scale-y-100
                      "
                    />

                    {/* Background number */}

                    <span
                      aria-hidden="true"
                      className="
                        absolute
                        right-5
                        top-2
                        text-7xl
                        font-black
                        leading-none
                        text-slate-100
                        transition-colors
                        duration-300
                        group-hover:text-[#E91E63]/[0.06]
                      "
                    >
                      0{index + 1}
                    </span>

                    {/* Content */}

                    <div
                      className="
                        relative
                        z-10
                        flex
                        gap-5
                      "
                    >
                      {/* Icon */}

                      <div
                        className="
                          flex
                          h-14
                          w-14
                          shrink-0
                          items-center
                          justify-center
                          rounded-2xl
                          border
                          border-[#E91E63]/15
                          bg-[#E91E63]/[0.06]
                          transition-all
                          duration-300
                          group-hover:border-[#E91E63]/30
                          group-hover:bg-[#E91E63]/10
                        "
                      >
                        <Icon
                          size={27}
                          strokeWidth={1.8}
                          className="
                            text-[#E91E63]
                            transition-transform
                            duration-300
                            group-hover:scale-110
                          "
                        />
                      </div>

                      {/* Text */}

                      <div className="min-w-0">
                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-4
                          "
                        >
                          <h3
                            className="
                              text-lg
                              font-bold
                              text-slate-950
                              sm:text-xl
                            "
                          >
                            {
                              feature.title
                            }
                          </h3>

                          <ArrowUpRight
                            size={20}
                            className="
                              mt-0.5
                              shrink-0
                              text-slate-300
                              transition-all
                              duration-300
                              group-hover:-translate-y-1
                              group-hover:translate-x-1
                              group-hover:text-[#E91E63]
                            "
                          />
                        </div>

                        <p
                          className="
                            mt-2
                            max-w-lg
                            text-sm
                            leading-7
                            text-slate-500
                            sm:text-base
                          "
                        >
                          {
                            feature.description
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </section>
  );
}