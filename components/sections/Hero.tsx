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
        bg-background
        pt-24
        lg:pt-28
      "
    >
      {/* ================================================= */}
      {/* BACKGROUND GRID */}
      {/* ================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
        "
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              currentColor 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              currentColor 1px,
              transparent 1px
            )
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* ================================================= */}
      {/* AMBIENT GLOW */}
      {/* ================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[600px]
          w-[600px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-primary/[0.08]
          blur-[160px]
          lg:h-[800px]
          lg:w-[800px]
        "
      />

      {/* ================================================= */}
      {/* SMALL TOP LINE */}
      {/* ================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-24
          hidden
          h-px
          w-[min(90%,1200px)]
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-primary/20
          to-transparent
          lg:block
        "
      />

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div
        className="
          relative
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
        {/* LEFT SIDE */}
        {/* ================================================= */}

        <div className="relative z-10 max-w-2xl">
          {/* BADGE */}

          <div className="mb-7">
            <div
              className="
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-primary/20
                bg-primary/[0.04]
                px-4
                py-2
                backdrop-blur-sm
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-primary
                  shadow-[0_0_12px_rgba(0,0,0,0.15)]
                "
              />

              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.24em]
                  text-primary
                  sm:text-xs
                "
              >
                {t.hero.badge}
              </p>
            </div>
          </div>

          {/* TITLE */}

          <h1
            className="
              text-5xl
              font-black
              leading-[0.98]
              tracking-[-0.045em]
              text-foreground
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
                text-primary
              "
            >
              {t.hero.title2}
            </span>

            <span className="block">
              {t.hero.title3}
            </span>
          </h1>

          {/* DESCRIPTION */}

          <p
            className="
              mt-8
              max-w-xl
              text-base
              leading-7
              text-muted-foreground
              sm:text-lg
              sm:leading-8
            "
          >
            {t.hero.description}
          </p>

          {/* CTA BUTTONS */}

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
                bg-primary
                px-7
                py-3.5
                text-sm
                font-semibold
                text-primary-foreground
                shadow-lg
                shadow-primary/10
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-accent
                hover:shadow-xl
                hover:shadow-primary/20
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
                border-border
                bg-background/60
                px-7
                py-3.5
                text-sm
                font-semibold
                text-foreground
                backdrop-blur-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-primary/40
                hover:bg-primary/[0.04]
                hover:text-primary
              "
            >
              {t.hero.secondaryButton}
            </Link>
          </div>

          {/* ================================================= */}
          {/* STATS */}
          {/* ================================================= */}

          <div
            className="
              mt-14
              grid
              grid-cols-2
              border-t
              border-border/70
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
                        ? "border-l border-border/60"
                        : ""
                    }
                  `}
                >
                  <p
                    className="
                      text-2xl
                      font-black
                      tracking-tight
                      text-foreground
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
                      text-muted-foreground
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
        {/* RIGHT SIDE — ENGINEERING GRAPHIC */}
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
          {/* Outer glow */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              h-[320px]
              w-[320px]
              rounded-full
              bg-primary/[0.06]
              blur-3xl
              sm:h-[420px]
              sm:w-[420px]
            "
          />

          {/* Technical frame */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              h-[340px]
              w-[340px]
              rounded-full
              border
              border-primary/10
              sm:h-[450px]
              sm:w-[450px]
              lg:h-[520px]
              lg:w-[520px]
            "
          />

          {/* Graphic */}

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
              text-muted-foreground/50
              lg:flex
            "
          >
            <span>
              CONTROL
            </span>

            <span className="text-primary/40">
              •
            </span>

            <span>
              CONNECT
            </span>

            <span className="text-primary/40">
              •
            </span>

            <span>
              AUTOMATE
            </span>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* BOTTOM FADE */}
      {/* ================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          h-24
          bg-gradient-to-t
          from-background
          to-transparent
        "
      />
    </section>
  );
}