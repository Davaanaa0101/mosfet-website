import Link from "next/link";
import Image from "next/image";
import { t } from "@/lib/i18n";

export default function Footer() {
  return (
    <footer className="border-b border-primary/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid gap-10 md:grid-cols-3">

          {/* Company */}

          <div>

            <div>

  <Image
    src="/logo.svg"
    alt="MOSFET"
    width={220}
    height={60}
    className="h-12 w-auto"
  />

  <p className="mt-4 max-w-xs text-muted-foreground">
    {t.footer.slogan}
  </p>

</div>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="mb-4 font-semibold text-foreground">
              {t.footer.quickLinks}
            </h3>

            <div className="space-y-3">

              <Link
                href="#hero"
                className="block text-muted-foreground transition-colors hover:text-primary"
              >
                {t.nav.home}
              </Link>

              <Link
                href="#about"
                className="block text-muted-foreground transition-colors hover:text-primary"
              >
                {t.nav.about}
              </Link>

              <Link
                href="#services"
                className="block text-muted-foreground transition-colors hover:text-primary"
              >
                {t.nav.services}
              </Link>

              <Link
                href="#contact"
                className="block text-muted-foreground transition-colors hover:text-primary"
              >
                {t.nav.contact}
              </Link>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="mb-4 font-semibold text-foreground">
              {t.footer.contact}
            </h3>

            <div className="space-y-3">

              <p className="text-muted-foreground">
                {t.footer.phone}
              </p>

              <p className="text-muted-foreground">
                {t.footer.email}
              </p>

              <p className="text-muted-foreground">
                {t.footer.website}
              </p>

            </div>

          </div>

        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MOSFET. {t.footer.copyright}
        </div>

      </div>
    </footer>
  );
}