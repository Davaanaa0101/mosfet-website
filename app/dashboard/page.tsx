import ElectricityBillCard from "@/components/dashboard/ElectricityBillCard";
import DeviceStatus from "@/components/dashboard/DeviceStatus";
import LatestTelemetry from "@/components/dashboard/LatestTelemetry";
import RecentActivity from "@/components/dashboard/RecentActivity";
import StatsGrid from "@/components/dashboard/StatsGrid";

export default function DashboardPage() {
  return (
    <div
      className="
        mosfet-glass-page
        relative
        isolate
        min-h-full
        overflow-hidden
        rounded-[28px]
        bg-[#07111F]
        p-4
        text-slate-100
        sm:p-6
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
            -right-40
            -top-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-400/[0.08]
            blur-[120px]
          "
        />

        {/* Pink glow */}

        <div
          className="
            absolute
            -left-40
            top-[35%]
            h-[450px]
            w-[450px]
            rounded-full
            bg-blue-500/[0.07]
            blur-[120px]
          "
        />

        {/* Technical grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
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
              "radial-gradient(ellipse 80% 80% at 50% 20%, black, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 50% 20%, black, transparent 85%)",
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
          space-y-8
        "
      >
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            {/* Small label */}

            <div
              className="
                mb-3
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-[#E91E63]
                  shadow-[0_0_10px_rgba(233,30,99,0.5)]
                "
              />

              <span
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.25em]
                  text-cyan-300
                "
              >
                Ухаалаг барилга
              </span>
            </div>

            {/* Title */}

            <h1
              className="
                text-3xl
                font-black
                tracking-tight
                text-white
                sm:text-4xl
              "
            >
              Хяналтын самбар
            </h1>

            {/* Description */}

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-slate-500
                sm:text-base
              "
            >
              Холбогдсон төхөөрөмжүүд, мэдрэгчийн өгөгдөл болон барилгын төлөвийг бодит цаг хугацаанд хянана.
            </p>
          </div>

          {/* System indicator */}

          <div
            className="
              flex
              w-fit
              items-center
              gap-2.5
              rounded-full
              border
              border-emerald-200
              bg-emerald-50
              px-3.5
              py-2
              text-xs
              font-medium
              text-emerald-300
            "
          >
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-emerald-500
                shadow-[0_0_8px_rgba(16,185,129,0.5)]
              "
            />

            Monitoring active
          </div>
        </div>

        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <section>
          <StatsGrid />
        </section>

        <ElectricityBillCard />

        {/* ================================================= */}
        {/* LATEST TELEMETRY */}
        {/* ================================================= */}

        <section
          className="
            overflow-hidden
            rounded-3xl
          "
        >
          <LatestTelemetry />
        </section>

        {/* ================================================= */}
        {/* DEVICES + ACTIVITY */}
        {/* ================================================= */}

        <section
          className="
            grid
            gap-6
            lg:grid-cols-2
          "
        >
          <div
            className="
              min-w-0
              overflow-hidden
              rounded-3xl
            "
          >
            <DeviceStatus />
          </div>

          <div
            className="
              min-w-0
              overflow-hidden
              rounded-3xl
            "
          >
            <RecentActivity />
          </div>
        </section>

        {/* ================================================= */}
        {/* BOTTOM STATUS */}
        {/* ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-white/10
            pt-5
            text-[11px]
            text-slate-400
          "
        >
          <span>
            MOSFET Ухаалаг барилга Platform
          </span>

          <span className="hidden sm:block">
            Live telemetry monitoring
          </span>
        </div>
      </div>
    </div>
  );
}