"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import Container from "@/components/ui/Container";
import { t } from "@/lib/i18n";
import QuoteDialog from "@/components/forms/QuoteDialog";

const links = [
  {
    name: t.nav.home,
    href: "#hero",
  },
  {
    name: t.nav.about,
    href: "#about",
  },
  {
    name: t.nav.services,
    href: "#services",
  },
  {
    name: t.nav.contact,
    href: "#contact",
  },
];

export default function Navbar() {
  const [visible, setVisible] =
    useState(true);

  const [lastScrollY, setLastScrollY] =
    useState(0);

  const [scrolled, setScrolled] =
    useState(false);

  const [quoteOpen, setQuoteOpen] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const current =
        window.scrollY;

      setScrolled(
        current > 20
      );

      if (current < 80) {
        setVisible(true);
      } else if (
        current > lastScrollY
      ) {
        // Scrolling down
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }

      setLastScrollY(
        current
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [lastScrollY]);

  return (
    <>
      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <header
        className={`
          fixed
          inset-x-0
          top-0
          z-50
          transform
          transition-all
          duration-300
          ${
            visible
              ? "translate-y-0"
              : "-translate-y-full"
          }
          ${
            scrolled
              ? `
                border-b
                border-white/10
                bg-[#07111F]/90
                shadow-[0_10px_40px_rgba(0,0,0,0.15)]
                backdrop-blur-xl
              `
              : `
                bg-transparent
              `
          }
        `}
      >
        <Container
          className={`
            flex
            items-center
            justify-between
            transition-all
            duration-300
            ${
              scrolled
                ? "h-20"
                : "h-24"
            }
          `}
        >
          {/* ================================================= */}
          {/* LOGO */}
          {/* ================================================= */}

          <Link
            href="/"
            className="
              group
              flex
              items-center
            "
          >
            <Image
              src="/logo.svg"
              alt="MOSFET"
              width={220}
              height={60}
              priority
              className="
                h-12
                w-auto
                transition-transform
                duration-300
                group-hover:scale-[1.02]
              "
            />
          </Link>

          {/* ================================================= */}
          {/* NAVIGATION */}
          {/* ================================================= */}

          <nav
            className="
              hidden
              items-center
              gap-8
              lg:flex
            "
          >
            {links.map(
              (link) => (
                <Link
                  key={
                    link.name
                  }
                  href={
                    link.href
                  }
                  className="
                    relative
                    text-sm
                    font-medium
                    text-white/65
                    transition-colors
                    duration-200
                    hover:text-white
                  "
                >
                  {link.name}

                  {/* Hover underline */}

                  <span
                    className="
                      absolute
                      -bottom-2
                      left-0
                      h-px
                      w-0
                      bg-[#E91E63]
                      transition-all
                      duration-300
                      group-hover:w-full
                    "
                  />
                </Link>
              )
            )}
          </nav>

          {/* ================================================= */}
          {/* ACTIONS */}
          {/* ================================================= */}

          <div
            className="
              hidden
              items-center
              gap-3
              lg:flex
            "
          >
            {/* ============================================= */}
            {/* LOGIN */}
            {/* ============================================= */}

            <Link
              href="/login"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                border
                border-white/20
                bg-white/[0.05]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                backdrop-blur-md
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#E91E63]/60
                hover:bg-[#E91E63]/10
                hover:text-white
              "
            >
              Login
            </Link>

            {/* ============================================= */}
            {/* QUOTE */}
            {/* ============================================= */}

            <button
              type="button"
              onClick={() =>
                setQuoteOpen(
                  true
                )
              }
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-[#E91E63]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-[0_0_25px_rgba(233,30,99,0.15)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#D81B60]
                hover:shadow-[0_0_35px_rgba(233,30,99,0.3)]
              "
            >
              {t.nav.quote}
            </button>
          </div>
        </Container>
      </header>

      {/* ================================================= */}
      {/* QUOTE DIALOG */}
      {/* ================================================= */}

      <QuoteDialog
        open={
          quoteOpen
        }
        onOpenChange={
          setQuoteOpen
        }
      />
    </>
  );
}