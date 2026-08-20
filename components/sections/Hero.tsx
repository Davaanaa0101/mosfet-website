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
      {/* DARK TECHNICAL BACKGROUND */}
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
        {/* ----------------------------------------------- */}
        {/* BASE BACKGROUND */}
        {/* ----------------------------------------------- */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_72%_45%,rgba(37,99,235,0.18),transparent_38%),linear-gradient(135deg,#07111F_0%,#0A1628_50%,#050B14_100%)]
          "
        />

        {/* ----------------------------------------------- */}
        {/* LARGE BLUE GLOW - LEFT */}
        {/* ----------------------------------------------- */}

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

        {/* ----------------------------------------------- */}
        {/* LARGE BLUE GLOW - RIGHT */}
        {/* ----------------------------------------------- */}

        <div
          className="
            absolute
            -right-[220px]
            top-[5%]
            h-[700px]
            w-[700px]
            rounded-full
            bg-primary/[0.10]
            blur-[160px]
          "
        />

        {/* ----------------------------------------------- */}
        {/* CENTER LIGHT BEHIND CIRCUIT */}
        {/* ----------------------------------------------- */}

        <div
          className="
            absolute
            left-[65%]
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

        {/* ----------------------------------------------- */}
        {/* SECOND CENTER GLOW */}
        {/* ----------------------------------------------- */}

        <div
          className="
            absolute
            left-[72%]
            top-[50%]
            h-[300px]
            w-[300px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-primary/[0.12]
            blur-[100px]
          "
        />

        {/* ----------------------------------------------- */}
        {/* ENGINEERING GRID */}
        {/* ----------------------------------------------- */}

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
            backgroundSize:
              "48px 48px",
            maskImage:
              "radial-gradient(ellipse 90% 80% at 65% 45%, black 15%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 80% at 65% 45%, black 15%, transparent 85%)",
          }}
        />

        {/* ----------------------------------------------- */}
        {/* SMALL TECHNICAL DOTS */}
        {/* ----------------------------------------------- */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.28]
          "
          style={{
            backgroundImage:
              "radial-gradient(rgba(96,165,250,0.45) 1px, transparent 1px)",
            backgroundSize:
              "32px 32px",
            maskImage:
              "radial-gradient(ellipse 70% 70% at 70% 45%, black, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 70% at 70% 45%, black, transparent 80%)",
          }}
        />

        {/* ----------------------------------------------- */}
        {/* TOP TECHNICAL LINE */}
        {/* ----------------------------------------------- */}

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

        {/* ----------------------------------------------- */}
        {/* DIAGONAL LINE 1 */}
        {/* ----------------------------------------------- */}

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

        {/* ----------------------------------------------- */}
        {/* DIAGONAL LINE 2 */}
        {/* ----------------------------------------------- */}

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
            via-primary/15
            to-transparent
          "
        />

        {/* ----------------------------------------------- */}
        {/* VERTICAL TECHNICAL LINE */}
        {/* ----------------------------------------------- */}

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

        {/* ----------------------------------------------- */}
        {/* HORIZONTAL TECHNICAL LINE */}
        {/* ----------------------------------------------- */}

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

        {/* ----------------------------------------------- */}
        {/* TECHNICAL NODE 1 */}
        {/* ----------------------------------------------- */}

        <div
          className="
            absolute
            right-[28%]
            top-[22%]
            h-2
            w-2
            rounded-full
            bg-blue-400/60
            shadow-[0_0_22px_rgba(96,165,250,0.7)]
          "
        />

        {/* ----------------------------------------------- */}
        {/* TECHNICAL NODE 2 */}
        {/* ----------------------------------------------- */}

        <div
          className="
            absolute
            right-[12%]
            top-[48%]
            h-1.5
            w-1.5
            rounded-full
            bg-primary/60
            shadow-[0_0_18px_hsl(var(--primary)/0.7)]
          "
        />

        {/* ----------------------------------------------- */}
        {/* TECHNICAL NODE 3 */}
        {/* ----------------------------------------------- */}

        <div
          className="
            absolute
            left-[48%]
            bottom-[18%]
            h-1.5
            w-1.5
            rounded-full
            bg-blue-400/50
            shadow-[0_0_18px_rgba(96,165,250,0.6)]
          "
        />

        {/* ----------------------------------------------- */}
        {/* TECHNICAL NODE 4 */}
        {/* ----------------------------------------------- */}

        <div
          className="
            absolute
            left-[14%]
            top-[32%]
            h-1
            w-1
            rounded-full
            bg-primary/50
            shadow-[0_0_14px_hsl(var(--primary)/0.6)]
          "
        />

        {/* ----------------------------------------------- */}
        {/* BOTTOM VIGNETTE */}
        {/* ----------------------------------------------- */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-48
            bg-gradient-to-t
            from-[#050B14]
            to-transparent
          "
        />

        {/* ----------------------------------------------- */}
        {/* LEFT VIGNETTE */}
        {/* ----------------------------------------------- */}

        <div
          className="
            absolute
            inset-y-0
            left-0
            w-40
            bg-gradient-to-r
            from-[#07111F]/60
            to-transparent
          "
        />

        {/* ----------------------------------------------- */}
        {/* RIGHT VIGNETTE */}
        {/* ----------------------------------------------- */}

        <div
          className="
            absolute
            inset-y-0
            right-0
            w-40
            bg-gradient-to-l
            from-[#050B14]/60
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
                border-blue-400/20
                bg-blue-400/[0.06]
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
                  bg-primary
                  shadow-[0_0_14px_hsl(var(--primary)/0.8)]
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
                text-primary
                drop-shadow-[0_0_24px_hsl(var(--primary)/0.25)]
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
              text-slate-300
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
                shadow-[0_0_30px_hsl(var(--primary)/0.18)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-accent
                hover:shadow-[0_0_40px_hsl(var(--primary)/0.3)]
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
                hover:border-primary/40
                hover:bg-primary/[0.08]
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
          {/* LARGE ENGINEERING GLOW */}
          {/* =============================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              h-[340px]
              w-[340px]
              rounded-full
              bg-primary/[0.08]
              blur-[90px]
              sm:h-[450px]
              sm:w-[450px]
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
              border-primary/15
              shadow-[0_0_80px_hsl(var(--primary)/0.05)]
              sm:h-[450px]
              sm:w-[450px]
              lg:h-[520px]
              lg:w-[520px]
            "
          />

          {/* =============================================== */}
          {/* DASHED RING */}
          {/* =============================================== */}

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
              border-blue-400/15
              sm:h-[360px]
              sm:w-[360px]
              lg:h-[410px]
              lg:w-[410px]
            "
          />

          {/* =============================================== */}
          {/* INNER RING */}
          {/* =============================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              h-[180px]
              w-[180px]
              rounded-full
              border
              border-primary/10
              sm:h-[250px]
              sm:w-[250px]
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
              text-slate-500
              lg:flex
            "
          >
            <span>
              CONTROL
            </span>

            <span className="text-primary/60">
              •
            </span>

            <span>
              CONNECT
            </span>

            <span className="text-primary/60">
              •
            </span>

            <span>
              AUTOMATE
            </span>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* BOTTOM TRANSITION */}
      {/* ================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-32
          bg-gradient-to-t
          from-background
          to-transparent
        "
      />
    </section>
  );
}