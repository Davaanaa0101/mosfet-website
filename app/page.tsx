import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* ================================================= */}
      {/* GLOBAL AMBIENT BACKGROUND */}
      {/* ================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        {/* Top glow */}

        <div
          className="
            absolute
            -left-40
            -top-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-primary/5
            blur-3xl
          "
        />

        {/* Right glow */}

        <div
          className="
            absolute
            -right-40
            top-[35%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-primary/5
            blur-3xl
          "
        />

        {/* Bottom glow */}

        <div
          className="
            absolute
            -bottom-40
            left-1/3
            h-[450px]
            w-[450px]
            rounded-full
            bg-primary/5
            blur-3xl
          "
        />
      </div>

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <Navbar />

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="relative">
        {/* =============================================== */}
        {/* HERO */}
        {/* =============================================== */}

        <section
          id="hero"
          className="relative"
        >
          <Hero />
        </section>

        {/* =============================================== */}
        {/* ABOUT */}
        {/* =============================================== */}

        <section
          id="about"
          className="
            relative
            scroll-mt-20
            border-t
            border-border/40
          "
        >
          <div
            className="
              absolute
              inset-x-0
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-primary/20
              to-transparent
            "
          />

          <About />
        </section>

        {/* =============================================== */}
        {/* SERVICES */}
        {/* =============================================== */}

        <section
          id="services"
          className="
            relative
            scroll-mt-20
            border-t
            border-border/40
            bg-muted/[0.18]
          "
        >
          <div
            className="
              absolute
              inset-x-0
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-primary/20
              to-transparent
            "
          />

          <Services />
        </section>

        {/* =============================================== */}
        {/* CONTACT */}
        {/* =============================================== */}

        <section
          id="contact"
          className="
            relative
            scroll-mt-20
            border-t
            border-border/40
          "
        >
          <div
            className="
              absolute
              inset-x-0
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-primary/20
              to-transparent
            "
          />

          <Contact />
        </section>
      </main>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <Footer />
    </div>
  );
}