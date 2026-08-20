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

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, [lastScrollY]);

  return (
    <>
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
              ? "border-b border-primary/10 bg-background/80 backdrop-blur-xl"
              : "bg-transparent"
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
          {/* ========================================= */}
          {/* LOGO */}
          {/* ========================================= */}

          <Link
            href="/"
            className="flex items-center"
          >
            <Image
              src="/logo.svg"
              alt="MOSFET"
              width={220}
              height={60}
              priority
              className="h-12 w-auto"
            />
          </Link>

          {/* ========================================= */}
          {/* NAVIGATION */}
          {/* ========================================= */}

          <nav className="hidden items-center gap-8 lg:flex">
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
                    text-sm
                    font-medium
                    text-muted-foreground
                    transition-colors
                    hover:text-primary
                  "
                >
                  {
                    link.name
                  }
                </Link>
              )
            )}
          </nav>

          {/* ========================================= */}
          {/* ACTIONS */}
          {/* ========================================= */}

          <div className="hidden items-center gap-3 lg:flex">
            {/* LOGIN */}

            <Link
              href="/login"
              className="
                rounded-xl
                border
                border-primary/20
                bg-background/50
                px-5
                py-3
                text-sm
                font-semibold
                text-foreground
                transition-all
                duration-300
                hover:border-primary
                hover:bg-primary/5
                hover:text-primary
              "
            >
              Login
            </Link>

            {/* GET A QUOTE */}

            <button
              type="button"
              onClick={() =>
                setQuoteOpen(
                  true
                )
              }
              className="
                rounded-xl
                bg-primary
                px-5
                py-3
                text-sm
                font-semibold
                text-primary-foreground
                transition-all
                duration-300
                hover:bg-accent
                hover:shadow-lg
                hover:shadow-primary/30
              "
            >
              {
                t.nav.quote
              }
            </button>
          </div>
        </Container>
      </header>

      {/* ========================================= */}
      {/* QUOTE DIALOG */}
      {/* ========================================= */}

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