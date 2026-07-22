import { t } from "@/lib/i18n";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-card py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}

        <div className="text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            {t.contact.badge}
          </p>

          <h2 className="mt-4 text-4xl font-bold text-foreground">
            {t.contact.title}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            {t.contact.description}
          </p>

        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">

          {/* Contact Information */}

          <div className="rounded-3xl border border-border bg-background p-8">

            <h3 className="text-2xl font-bold text-foreground">
              {t.contact.info.title}
            </h3>

            <div className="mt-8 space-y-6">

              <div>
                <p className="text-sm text-muted-foreground">
                  {t.contact.info.phoneLabel}
                </p>

                <p className="text-lg font-medium text-foreground">
                  {t.contact.info.phone}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  {t.contact.info.emailLabel}
                </p>

                <p className="text-lg font-medium text-foreground">
                  {t.contact.info.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  {t.contact.info.websiteLabel}
                </p>

                <p className="text-lg font-medium text-foreground">
                  {t.contact.info.website}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  {t.contact.info.addressLabel}
                </p>

                <p className="text-lg font-medium text-foreground">
                  {t.contact.info.address}
                </p>
              </div>

            </div>

          </div>

          {/* Contact Form */}

          <div className="rounded-3xl border border-border bg-background p-8">

            <div className="space-y-5">

              <input
                type="text"
                placeholder={t.contact.form.name}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <input
                type="email"
                placeholder={t.contact.form.email}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <textarea
                rows={6}
                placeholder={t.contact.form.message}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <button
                className="w-full rounded-xl bg-primary py-4 font-semibold text-primary-foreground transition-all duration-300 hover:bg-accent hover:shadow-lg hover:shadow-primary/20"
              >
                {t.contact.form.submit}
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}