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
      {/* PREMIUM ENGINEERING BACKGROUND */}
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
        {/* =============================================== */}
        {/* BASE GRADIENT */}
        {/* =============================================== */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-background
            via-background
            to-primary/[0.035]
          "
        />

        {/* =============================================== */}
        {/* LEFT ATMOSPHERIC GLOW */}
        {/* =============================================== */}

        <div
          className="
            absolute
            -left-[280px]
            -top-[220px]
            h-[700px]
            w-[700px]
            rounded-full
            bg-primary/[0.10]
            blur-[140px]
          "
        />

        {/* =============================================== */}
        {/* RIGHT ATMOSPHERIC GLOW */}
        {/* =============================================== */}

        <div
          className="
            absolute
            -right-[220px]
            top-[5%]
            h-[650px]
            w-[650px]
            rounded-full
            bg-primary/[0.07]
            blur-[150px]
          "
        />

        {/* =============================================== */}
        {/* CENTER GLOW */}
        {/* =============================================== */}

        <div
          className="
            absolute
            left-[58%]
            top-[52%]
            h-[600px]
            w-[600px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-primary/[0.08]
            blur-[130px]
          "
        />

        {/* =============================================== */}
        {/* FINE ENGINEERING GRID */}
        {/* =============================================== */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.045]
          "
          style={{
            backgroundImage: `
              linear-gradient(
                to right,
                hsl(var(--primary) / 0.35) 1px,
                transparent 1px
              ),
              linear-gradient(
                to bottom,
                hsl(var(--primary) / 0.35) 1px,
                transparent 1px
              )
            `,
            backgroundSize:
              "48px 48px",
            maskImage:
              "radial-gradient(ellipse 85% 75% at 55% 45%, black 25%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 85% 75% at 55% 45%, black 25%, transparent 85%)",
          }}
        />

        {/* =============================================== */}
        {/* TECHNICAL DOT FIELD */}
        {/* =============================================== */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.22]
          "
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--primary) / 0.35) 1px, transparent 1px)",
            backgroundSize:
              "32px 32px",
            maskImage:
              "radial-gradient(ellipse 70% 70% at 65% 45%, black, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 70% at 65% 45%, black, transparent 75%)",
          }}
        />

        {/* =============================================== */}
        {/* DIAGONAL LIGHT LINE */}
        {/* =============================================== */}

        <div
          className="
            absolute
            -right-[10%]
            top-[12%]
            h-px
            w-[70%]
            rotate-[24deg]
            bg-gradient-to-r
            from-transparent
            via-primary/20
            to-transparent
            blur-[1px]
          "
        />

        {/* =============================================== */}
        {/* SECOND DIAGONAL LINE */}
        {/* =============================================== */}

        <div
          className="
            absolute
            -left-[15%]
            bottom-[20%]
            h-px
            w-[65%]
            rotate-[-18deg]
            bg-gradient-to-r
            from-transparent
            via-primary/10
            to-transparent
          "
        />

        {/* =============================================== */}
        {/* VERTICAL TECHNICAL BEAM */}
        {/* =============================================== */}

        <div
          className="
            absolute
            right-[18%]
            top-[15%]
            h-[420px]
            w-px
            bg-gradient-to-b
            from-transparent
            via-primary/15
            to-transparent
          "
        />

        {/* =============================================== */}
        {/* HORIZONTAL TECHNICAL BEAM */}
        {/* =============================================== */}

        <div
          className="
            absolute
            right-[5%]
            top-[42%]
            h-px
            w-[400px]
            bg-gradient-to-r
            from-transparent
            via-primary/15
            to-transparent
          "
        />

        {/* =============================================== */}
        {/* TECHNICAL NODE 1 */}
        {/* =============================================== */}

        <div
          className="
            absolute
            right-[28%]
            top-[22%]
            h-2
            w-2
            rounded-full
            bg-primary/40
            shadow-[0_0_20px_hsl(var(--primary)/0.5)]
          "
        />

        {/* =============================================== */}
        {/* TECHNICAL NODE 2 */}
        {/* =============================================== */}

        <div
          className="
            absolute
            right-[12%]
            top-[48%]
            h-1.5
            w-1.5
            rounded-full
            bg-primary/30
            shadow-[0_0_16px_hsl(var(--primary)/0.4)]
          "
        />

        {/* =============================================== */}
        {/* TECHNICAL NODE 3 */}
        {/* =============================================== */}

        <div
          className="
            absolute
            left-[48%]
            bottom-[18%]
            h-1.5
            w-1.5
            rounded-full
            bg-primary/30
            shadow-[0_0_16px_hsl(var(--primary)/0.4)]
          "
        />

        {/* =============================================== */}
        {/* TOP HORIZONTAL LINE */}
        {/* =============================================== */}

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
            via-primary/20
            to-transparent
            lg:block
          "
        />

        {/* =============================================== */}
        {/* BOTTOM FADE */}
        {/* =============================================== */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-40
            bg-gradient-to-t
            from-background
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
        {/* LEFT SIDE */}
        {/* ================================================= */}

        <div
          className="
            relative
            z-10
            max-w-2xl
          "
        >
          {/* =============================================== */}
          {/* BADGE */}
          {/* =============================================== */}

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
                  shadow-[0_0_12px_hsl(var(--primary)/0.5)]
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

          {/* =============================================== */}
          {/* TITLE */}
          {/* =============================================== */}

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

          {/* =============================================== */}
          {/* DESCRIPTION */}
          {/* =============================================== */}

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

          {/* =============================================== */}
          {/* CTA BUTTONS */}
          {/* =============================================== */}

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

          {/* =============================================== */}
          {/* STATISTICS */}
          {/* =============================================== */}

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
        {/* RIGHT SIDE */}
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
          {/* =============================================== */}
          {/* ENGINEERING FIELD */}
          {/* =============================================== */}

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

          {/* =============================================== */}
          {/* OUTER RING */}
          {/* =============================================== */}

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

          {/* =============================================== */}
          {/* SECOND RING */}
          {/* =============================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              h-[260px]
              w-[260px]
              rounded-full
              border
              border-dashed
              border-primary/10
              sm:h-[350px]
              sm:w-[350px]
              lg:h-[410px]
              lg:w-[410px]
            "
          />

          {/* =============================================== */}
          {/* CIRCUIT GRAPHIC */}
          {/* =============================================== */}

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

          {/* =============================================== */}
          {/* TECHNICAL LABELS */}
          {/* =============================================== */}

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
    </section>
  );
}