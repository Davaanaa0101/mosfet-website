"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";

const links = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 font-bold text-slate-950">
            M
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-widest text-white">
              MOSFET
            </h1>

            <p className="text-xs text-slate-400">
              Engineering Smarter Systems
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition hover:text-emerald-400"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/contact"
          className="hidden rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 lg:block"
        >
          Request Quote
        </Link>
      </Container>
    </header>
  );
}