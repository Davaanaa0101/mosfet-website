import DeviceStatus from "@/components/dashboard/DeviceStatus";
import RecentActivity from "@/components/dashboard/RecentActivity";
import StatsGrid from "@/components/dashboard/StatsGrid";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Welcome to the MOSFET Smart Building Platform.
        </p>
      </div>

      <StatsGrid />

      <div className="grid gap-6 lg:grid-cols-2">
        <DeviceStatus />
        <RecentActivity />
      </div>
    </div>
  );
}