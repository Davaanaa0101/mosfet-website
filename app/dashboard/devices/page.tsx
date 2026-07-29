import DeviceTable from "@/components/dashboard/DeviceTable";

export default function DevicesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Devices
        </h1>

        <p className="text-muted-foreground">
          Monitor and manage connected devices.
        </p>
      </div>

      <DeviceTable />
    </div>
  );
}