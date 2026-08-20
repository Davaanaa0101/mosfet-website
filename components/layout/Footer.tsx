import Link from "next/link";
import Image from "next/image";

import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";

import { t } from "@/lib/i18n";

export default function Footer() {
  return (
    <footer
      className="
        relative
        overflow-hidden
        border-t
        border-white/10
        bg-[#050B14]
        text-white
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
        {/* Blue glow */}

        <div
          className="
            absolute
            -left-[250px]
            -top-[200px]
            h-[550px]
            w-[550px]
            rounded-full
            bg-blue-500/[0.06]
            blur-[140px]
          "
        />

        {/* Pink glow */}

        <div
          className="
            absolute
            -right-[220px]
            top-[20%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-[#E91E63]/[0.06]
            blur-[130px]
          "
        />

        {/* Technical grid */}

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
          }}
        />

        {/* Top accent line */}

        <div
          className="
            absolute
            inset-x-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#E91E63]/50
            to-transparent
          "
        />
      </div>

      {/* ================================================= */}
      {/* MAIN FOOTER */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-6
          py-16
          sm:px-8
          lg:px-10
          lg:py-20
        "
      >
        <div
          className="
            grid
            gap-12
            lg:grid-cols-[1.3fr_0.7fr_1fr]
            lg:gap-16
          "
        >
          {/* ================================================= */}
          {/* COMPANY */}
          {/* ================================================= */}

          <div>
            {/* Logo */}

            <Link
              href="/"
              className="
                inline-flex
                items-center
              "
            >
              <Image
                src="/logo.svg"
                alt="MOSFET"
                width={220}
                height={60}
                className="
                  h-12
                  w-auto
                "
              />
            </Link>

            {/* Slogan */}

            <p
              className="
                mt-5
                max-w-md
                text-sm
                leading-7
                text-slate-400
              "
            >
              {t.footer.slogan}
            </p>

            {/* Technical label */}

            <div
              className="
                mt-7
                flex
                items-center
                gap-3
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.25em]
                text-slate-600
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#E91E63]
                  shadow-[0_0_10px_rgba(233,30,99,0.7)]
                "
              />

              Engineering

              <span className="text-[#E91E63]/60">
                •
              </span>

              Automation

              <span className="text-[#E91E63]/60">
                •
              </span>

              Technology
            </div>
          </div>

          {/* ================================================= */}
          {/* QUICK LINKS */}
          {/* ================================================= */}

          <div>
            <h3
              className="
                mb-6
                text-sm
                font-bold
                uppercase
                tracking-[0.2em]
                text-white
              "
            >
              {t.footer.quickLinks}
            </h3>

            <div className="space-y-3">
              <FooterLink
                href="#hero"
                label={t.nav.home}
              />

              <FooterLink
                href="#about"
                label={t.nav.about}
              />

              <FooterLink
                href="#services"
                label={t.nav.services}
              />

              <FooterLink
                href="#contact"
                label={t.nav.contact}
              />

              <FooterLink
                href="/login"
                label="Login"
              />
            </div>
          </div>

          {/* ================================================= */}
          {/* CONTACT */}
          {/* ================================================= */}

          <div>
            <h3
              className="
                mb-6
                text-sm
                font-bold
                uppercase
                tracking-[0.2em]
                text-white
              "
            >
              {t.footer.contact}
            </h3>

            <div className="space-y-4">
              {/* Phone */}

              <FooterContact
                icon={Phone}
                value={
                  t.footer.phone
                }
              />

              {/* Email */}

              <FooterContact
                icon={Mail}
                value={
                  t.footer.email
                }
              />

              {/* Website */}

              <FooterContact
                icon={Globe}
                value={
                  t.footer.website
                }
              />
            </div>

            {/* Contact CTA */}

            <Link
              href="#contact"
              className="
                group
                mt-7
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-[#E91E63]/30
                bg-[#E91E63]/[0.06]
                px-4
                py-2.5
                text-sm
                font-semibold
                text-[#F0447D]
                transition-all
                duration-300
                hover:border-[#E91E63]/60
                hover:bg-[#E91E63]/10
              "
            >
              {t.nav.contact}

              <ArrowUpRight
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </Link>
          </div>
        </div>

        {/* ================================================= */}
        {/* DIVIDER */}
        {/* ================================================= */}

        <div
          className="
            mt-14
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/10
            to-transparent
          "
        />

        {/* ================================================= */}
        {/* BOTTOM */}
        {/* ================================================= */}

        <div
          className="
            flex
            flex-col
            gap-4
            pt-7
            text-xs
            text-slate-500
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* Copyright */}

          <p>
            ©{" "}
            {new Date().getFullYear()}{" "}
            MOSFET.{" "}
            {t.footer.copyright}
          </p>

          {/* Status */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-400
                shadow-[0_0_8px_rgba(52,211,153,0.7)]
              "
            />

            <span>
              Smart Engineering Solutions
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ================================================= */
/* FOOTER LINK */
/* ================================================= */

function FooterLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="
        group
        flex
        w-fit
        items-center
        gap-2
        text-sm
        text-slate-400
        transition-colors
        duration-200
        hover:text-white
      "
    >
      <span
        className="
          h-px
          w-0
          bg-[#E91E63]
          transition-all
          duration-300
          group-hover:w-3
        "
      />

      {label}
    </Link>
  );
}

/* ================================================= */
/* CONTACT ITEM */
/* ================================================= */

function FooterContact({
  icon: Icon,
  value,
}: {
  icon: typeof Phone;
  value: string;
}) {
  return (
    <div
      className="
        group
        flex
        items-center
        gap-3
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          border-white/10
          bg-white/[0.03]
          transition-all
          duration-300
          group-hover:border-[#E91E63]/30
          group-hover:bg-[#E91E63]/10
        "
      >
        <Icon
          size={16}
          strokeWidth={1.8}
          className="
            text-slate-500
            transition-colors
            duration-300
            group-hover:text-[#F0447D]
          "
        />
      </div>

      <span
        className="
          break-all
          text-sm
          text-slate-400
          transition-colors
          duration-300
          group-hover:text-slate-200
        "
      >
        {value}
      </span>
    </div>
  );
}