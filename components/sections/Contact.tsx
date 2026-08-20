import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  Globe,
  Send,
} from "lucide-react";

import { t } from "@/lib/i18n";

export default function Contact() {
  return (
    <section
      id="contact"
      className="
        relative
        overflow-hidden
        bg-[#F8FAFC]
        py-24
        lg:py-32
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
            top-[10%]
            h-[550px]
            w-[550px]
            rounded-full
            bg-blue-500/[0.045]
            blur-[140px]
          "
        />

        {/* Pink glow */}

        <div
          className="
            absolute
            -right-[200px]
            bottom-[5%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-[#E91E63]/[0.045]
            blur-[130px]
          "
        />

        {/* Engineering grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
          "
          style={{
            backgroundImage: `
              linear-gradient(
                to right,
                #64748B 1px,
                transparent 1px
              ),
              linear-gradient(
                to bottom,
                #64748B 1px,
                transparent 1px
              )
            `,
            backgroundSize:
              "48px 48px",
            maskImage:
              "radial-gradient(ellipse 85% 75% at 50% 50%, black, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 85% 75% at 50% 50%, black, transparent 90%)",
          }}
        />
      </div>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-6
          sm:px-8
          lg:px-10
        "
      >
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div
          className="
            mx-auto
            max-w-3xl
            text-center
          "
        >
          {/* Badge */}

          <div className="mb-6">
            <div
              className="
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-[#E91E63]/20
                bg-[#E91E63]/[0.04]
                px-4
                py-2
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-[#E91E63]
                  shadow-[0_0_12px_rgba(233,30,99,0.4)]
                "
              />

              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.3em]
                  text-[#D81B60]
                  sm:text-xs
                "
              >
                {t.contact.badge}
              </p>
            </div>
          </div>

          {/* Title */}

          <h2
            className="
              text-4xl
              font-black
              leading-[1.05]
              tracking-[-0.035em]
              text-slate-950
              sm:text-5xl
              lg:text-6xl
            "
          >
            {t.contact.title}
          </h2>

          {/* Accent */}

          <div
            className="
              mx-auto
              mt-7
              h-1
              w-16
              rounded-full
              bg-[#E91E63]
            "
          />

          {/* Description */}

          <p
            className="
              mx-auto
              mt-7
              max-w-2xl
              text-base
              leading-8
              text-slate-600
              sm:text-lg
            "
          >
            {t.contact.description}
          </p>
        </div>

        {/* ================================================= */}
        {/* CONTACT AREA */}
        {/* ================================================= */}

        <div
          className="
            mt-16
            grid
            gap-6
            lg:grid-cols-[0.8fr_1.2fr]
            lg:gap-8
          "
        >
          {/* ================================================= */}
          {/* CONTACT INFORMATION */}
          {/* ================================================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-[#07111F]
              p-8
              text-white
              shadow-[0_20px_60px_rgba(15,23,42,0.10)]
              sm:p-9
            "
          >
            {/* Card glow */}

            <div
              aria-hidden="true"
              className="
                absolute
                -right-24
                -top-24
                h-64
                w-64
                rounded-full
                bg-[#E91E63]/10
                blur-[90px]
              "
            />

            <div
              aria-hidden="true"
              className="
                absolute
                -bottom-32
                -left-24
                h-64
                w-64
                rounded-full
                bg-blue-500/10
                blur-[90px]
              "
            />

            {/* Grid */}

            <div
              aria-hidden="true"
              className="
                absolute
                inset-0
                opacity-[0.035]
              "
              style={{
                backgroundImage: `
                  linear-gradient(
                    to right,
                    rgba(96,165,250,0.5) 1px,
                    transparent 1px
                  ),
                  linear-gradient(
                    to bottom,
                    rgba(96,165,250,0.5) 1px,
                    transparent 1px
                  )
                `,
                backgroundSize:
                  "36px 36px",
              }}
            />

            <div className="relative z-10">
              {/* Heading */}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-[#F4729B]
                    "
                  >
                    MOSFET
                  </p>

                  <h3
                    className="
                      mt-3
                      text-2xl
                      font-bold
                      text-white
                    "
                  >
                    {t.contact.info.title}
                  </h3>
                </div>

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#E91E63]/25
                    bg-[#E91E63]/10
                  "
                >
                  <Send
                    size={19}
                    className="text-[#F0447D]"
                  />
                </div>
              </div>

              {/* Contact details */}

              <div className="mt-9 space-y-5">
                {/* Phone */}

                <ContactItem
                  icon={Phone}
                  label={
                    t.contact.info
                      .phoneLabel
                  }
                  value={
                    t.contact.info.phone
                  }
                />

                {/* Email */}

                <ContactItem
                  icon={Mail}
                  label={
                    t.contact.info
                      .emailLabel
                  }
                  value={
                    t.contact.info.email
                  }
                />

                {/* Website */}

                <ContactItem
                  icon={Globe}
                  label={
                    t.contact.info
                      .websiteLabel
                  }
                  value={
                    t.contact.info.website
                  }
                />

                {/* Address */}

                <ContactItem
                  icon={MapPin}
                  label={
                    t.contact.info
                      .addressLabel
                  }
                  value={
                    t.contact.info.address
                  }
                />
              </div>

              {/* Bottom label */}

              <div
                className="
                  mt-9
                  flex
                  items-center
                  gap-3
                  border-t
                  border-white/10
                  pt-6
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-slate-500
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
          </div>

          {/* ================================================= */}
          {/* CONTACT FORM */}
          {/* ================================================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-8
              shadow-[0_20px_60px_rgba(15,23,42,0.06)]
              sm:p-9
            "
          >
            {/* Top accent */}

            <div
              className="
                absolute
                left-0
                right-0
                top-0
                h-1
                bg-gradient-to-r
                from-[#E91E63]
                via-[#F0447D]
                to-blue-400
              "
            />

            <div className="relative">
              {/* Form heading */}

              <div className="mb-7">
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-[#D81B60]
                  "
                >
                  GET IN TOUCH
                </p>

                <h3
                  className="
                    mt-2
                    text-2xl
                    font-bold
                    text-slate-950
                  "
                >
                  Start a conversation
                </h3>
              </div>

              {/* Form */}

              <form
                className="
                  space-y-5
                "
              >
                {/* Name */}

                <div>
                  <label
                    htmlFor="contact-name"
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >
                    {t.contact.form.name}
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    placeholder={
                      t.contact.form.name
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      py-3.5
                      text-sm
                      text-slate-950
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-slate-400
                      focus:border-[#E91E63]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#E91E63]/10
                    "
                  />
                </div>

                {/* Email */}

                <div>
                  <label
                    htmlFor="contact-email"
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >
                    {t.contact.form.email}
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    placeholder={
                      t.contact.form.email
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      py-3.5
                      text-sm
                      text-slate-950
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-slate-400
                      focus:border-[#E91E63]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#E91E63]/10
                    "
                  />
                </div>

                {/* Message */}

                <div>
                  <label
                    htmlFor="contact-message"
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >
                    {t.contact.form.message}
                  </label>

                  <textarea
                    id="contact-message"
                    rows={5}
                    placeholder={
                      t.contact.form.message
                    }
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      py-3.5
                      text-sm
                      text-slate-950
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-slate-400
                      focus:border-[#E91E63]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#E91E63]/10
                    "
                  />
                </div>

                {/* Submit */}

                <button
                  type="submit"
                  className="
                    group
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#E91E63]
                    py-4
                    text-sm
                    font-semibold
                    text-white
                    shadow-[0_0_25px_rgba(233,30,99,0.12)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#D81B60]
                    hover:shadow-[0_0_35px_rgba(233,30,99,0.25)]
                  "
                >
                  {t.contact.form.submit}

                  <ArrowUpRight
                    size={18}
                    className="
                      transition-transform
                      duration-300
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                    "
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================= */
/* CONTACT ITEM */
/* ================================================= */

function ContactItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        group
        flex
        items-start
        gap-4
      "
    >
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-white/10
          bg-white/[0.04]
          transition-all
          duration-300
          group-hover:border-[#E91E63]/30
          group-hover:bg-[#E91E63]/10
        "
      >
        <Icon
          size={18}
          strokeWidth={1.8}
          className="
            text-slate-400
            transition-colors
            duration-300
            group-hover:text-[#F0447D]
          "
        />
      </div>

      <div className="min-w-0">
        <p
          className="
            text-xs
            font-medium
            uppercase
            tracking-wider
            text-slate-500
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            break-words
            text-sm
            font-medium
            leading-6
            text-slate-200
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
}