import Link from "next/link";
import { t } from "@/lib/i18n";
import CircuitGraphic from "@/components/ui/CircuitGraphic";

export default function Hero() {
  return (
    <section
      id="hero"
      className="
        relative
        flex
        min-h-screen
        items-center
        overflow-hidden
        bg-[#07111F]
        pt-24
        text-white
        lg:pt-28
      "
    >
      {/* ================================================= */}
      {/* PREMIUM DARK ENGINEERING BACKGROUND */}
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
        {/* Base background */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_72%_45%,rgba(37,99,235,0.18),transparent_38%),linear-gradient(135deg,#07111F_0%,#0A1628_52%,#050B14_100%)]
          "
        />

        {/* Left atmospheric glow */}

        <div
          className="
            absolute
            -left-[280px]
            -top-[250px]
            h-[700px]
            w-[700px]
            rounded-full
            bg-blue-500/[0.08]
            blur-[150px]
          "
        />

        {/* Right atmospheric glow */}

        <div
          className="
            absolute
            -right-[220px]
            top-[5%]
            h-[700px]
            w-[700px]
            rounded-full
            bg-[#E91E63]/[0.06]
            blur-[160px]
          "
        />

        {/* Main center glow */}

        <div
          className="
            absolute
            left-[67%]
            top-[52%]
            h-[650px]
            w-[650px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-blue-500/[0.10]
            blur-[130px]
          "
        />

        {/* Pink center accent */}

        <div
          className="
            absolute
            left-[72%]
            top-[50%]
            h-[320px]
            w-[320px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#E91E63]/[0.07]
            blur-[110px]
          "
        />

        {/* ================================================= */}
        {/* ENGINEERING GRID */}
        {/* ================================================= */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.075]
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
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 90% 80% at 65% 45%, black 15%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 80% at 65% 45%, black 15%, transparent 85%)",
          }}
        />

        {/* Technical dot field */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.28]
          "
          style={{
            backgroundImage:
              "radial-gradient(rgba(96,165,250,0.45) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse 70% 70% at 70% 45%, black, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 70% at 70% 45%, black, transparent 80%)",
          }}
        />

        {/* ================================================= */}
        {/* TECHNICAL LINES */}
        {/* ================================================= */}

        <div
          className="
            absolute
            left-1/2
            top-24
            hidden
            h-px
            w-[min(90%,1200px)]
            -translate-x-1/2
            bg-gradient-to-r
            from-transparent
            via-blue-400/20
            to-transparent
            lg:block
          "
        />

        <div
          className="
            absolute
            -right-[5%]
            top-[17%]
            h-px
            w-[65%]
            rotate-[24deg]
            bg-gradient-to-r
            from-transparent
            via-blue-400/20
            to-transparent
          "
        />

        <div
          className="
            absolute
            -left-[15%]
            bottom-[22%]
            h-px
            w-[65%]
            rotate-[-18deg]
            bg-gradient-to-r
            from-transparent
            via-[#E91E63]/20
            to-transparent
          "
        />

        <div
          className="
            absolute
            right-[18%]
            top-[15%]
            h-[420px]
            w-px
            bg-gradient-to-b
            from-transparent
            via-blue-400/20
            to-transparent
          "
        />

        <div
          className="
            absolute
            right-[5%]
            top-[42%]
            h-px
            w-[400px]
            bg-gradient-to-r
            from-transparent
            via-blue-400/20
            to-transparent
          "
        />

        {/* ================================================= */}
        {/* TECHNICAL NODES */}
        {/* ================================================= */}

        <div
          className="
            absolute
            right-[28%]
            top-[22%]
            h-2
            w-2
            rounded-full
            bg-blue-400/70
            shadow-[0_0_22px_rgba(96,165,250,0.8)]
          "
        />

        <div
          className="
            absolute
            right-[12%]
            top-[48%]
            h-1.5
            w-1.5
            rounded-full
            bg-[#E91E63]/70
            shadow-[0_0_18px_rgba(233,30,99,0.8)]
          "
        />

        <div
          className="
            absolute
            left-[48%]
            bottom-[18%]
            h-1.5
            w-1.5
            rounded-full
            bg-blue-400/60
            shadow-[0_0_18px_rgba(96,165,250,0.7)]
          "
        />

        <div
          className="
            absolute
            left-[14%]
            top-[32%]
            h-1
            w-1
            rounded-full
            bg-[#E91E63]/60
            shadow-[0_0_14px_rgba(233,30,99,0.7)]
          "
        />

        {/* Bottom vignette */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-24
            bg-gradient-to-t
            from-[#07111F]
            via-[#07111F]/70
            to-transparent
          "
        />
      </div>

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          grid
          w-full
          max-w-7xl
          items-center
          gap-14
          px-6
          py-16
          sm:px-8
          lg:grid-cols-[0.95fr_1.05fr]
          lg:gap-16
          lg:px-10
          lg:py-20
        "
      >
        {/* ================================================= */}
        {/* LEFT */}
        {/* ================================================= */}

        <div className="relative z-10 max-w-2xl">
          {/* Badge */}

          <div className="mb-7">
            <div
              className="
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-[#E91E63]/30
                bg-[#E91E63]/[0.06]
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
                  shadow-[0_0_14px_rgba(233,30,99,0.8)]
                "
              />

              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.24em]
                  text-[#F4729B]
                  sm:text-xs
                "
              >
                {t.hero.badge}
              </p>
            </div>
          </div>

          {/* Title */}

          <h1
            className="
              text-5xl
              font-black
              leading-[0.98]
              tracking-[-0.045em]
              text-white
              sm:text-6xl
              lg:text-7xl
              xl:text-[5.25rem]
            "
          >
            <span className="block">
              {t.hero.title1}
            </span>

            <span
              className="
                mt-1
                block
                text-[#F0447D]
                drop-shadow-[0_0_28px_rgba(233,30,99,0.25)]
              "
            >
              {t.hero.title2}
            </span>

            <span className="block">
              {t.hero.title3}
            </span>
          </h1>

          {/* Description */}

          <p
            className="
              mt-8
              max-w-xl
              text-base
              leading-7
              text-slate-300
              sm:text-lg
              sm:leading-8
            "
          >
            {t.hero.description}
          </p>

          {/* Buttons */}

          <div
            className="
              mt-9
              flex
              flex-wrap
              items-center
              gap-3
            "
          >
            <Link
              href="#contact"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-[#E91E63]
                px-7
                py-3.5
                text-sm
                font-semibold
                text-white
                shadow-[0_0_30px_rgba(233,30,99,0.18)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#D81B60]
                hover:shadow-[0_0_40px_rgba(233,30,99,0.35)]
              "
            >
              {t.hero.primaryButton}

              <span className="ml-2">
                →
              </span>
            </Link>

            <Link
              href="#services"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                border
                border-white/15
                bg-white/[0.04]
                px-7
                py-3.5
                text-sm
                font-semibold
                text-white
                backdrop-blur-md
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#E91E63]/50
                hover:bg-[#E91E63]/[0.08]
                hover:text-[#F4729B]
              "
            >
              {t.hero.secondaryButton}
            </Link>
          </div>

          {/* Statistics */}

          <div
            className="
              mt-14
              grid
              grid-cols-2
              border-t
              border-white/10
              pt-7
              sm:grid-cols-4
            "
          >
            {t.hero.stats.map(
              (item, index) => (
                <div
                  key={item.label}
                  className={`
                    relative
                    px-3
                    first:pl-0
                    sm:px-5
                    ${
                      index !== 0
                        ? "border-l border-white/10"
                        : ""
                    }
                  `}
                >
                  <p
                    className="
                      text-2xl
                      font-black
                      tracking-tight
                      text-white
                      sm:text-3xl
                    "
                  >
                    {item.value}
                  </p>

                  <p
                    className="
                      mt-1.5
                      max-w-[110px]
                      text-xs
                      leading-5
                      text-slate-400
                    "
                  >
                    {item.label}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* ================================================= */}
        {/* RIGHT / CIRCUIT */}
        {/* ================================================= */}

        <div
          className="
            relative
            flex
            min-h-[420px]
            items-center
            justify-center
            lg:min-h-[600px]
          "
        >
          {/* Main glow */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              h-[340px]
              w-[340px]
              rounded-full
              bg-blue-500/[0.08]
              blur-[90px]
              sm:h-[450px]
              sm:w-[450px]
            "
          />

          {/* Pink glow */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              h-[220px]
              w-[220px]
              rounded-full
              bg-[#E91E63]/[0.07]
              blur-[80px]
              sm:h-[300px]
              sm:w-[300px]
            "
          />

          {/* Outer ring */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              h-[340px]
              w-[340px]
              rounded-full
              border
              border-blue-400/15
              shadow-[0_0_80px_rgba(96,165,250,0.05)]
              sm:h-[450px]
              sm:w-[450px]
              lg:h-[520px]
              lg:w-[520px]
            "
          />

          {/* Dashed ring */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              h-[270px]
              w-[270px]
              rounded-full
              border
              border-dashed
              border-[#E91E63]/15
              sm:h-[360px]
              sm:w-[360px]
              lg:h-[410px]
              lg:w-[410px]
            "
          />

          {/* Inner ring */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              h-[180px]
              w-[180px]
              rounded-full
              border
              border-blue-400/10
              sm:h-[250px]
              sm:w-[250px]
            "
          />

          {/* Circuit */}

          <div
            className="
              relative
              z-10
              w-full
              max-w-[560px]
            "
          >
            <CircuitGraphic />
          </div>

          {/* Technical labels */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-4
              left-1/2
              hidden
              -translate-x-1/2
              items-center
              gap-3
              text-[9px]
              font-medium
              uppercase
              tracking-[0.25em]
              text-slate-500
              lg:flex
            "
          >
            <span>
              CONTROL
            </span>

            <span className="text-[#E91E63]/70">
              •
            </span>

            <span>
              CONNECT
            </span>

            <span className="text-[#E91E63]/70">
              •
            </span>

            <span>
              AUTOMATE
            </span>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* DARK BOTTOM TRANSITION */}
      {/* ================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-20
          bg-gradient-to-t
          from-[#07111F]
          via-[#07111F]/60
          to-transparent
        "
      />
    </section>
  );
}