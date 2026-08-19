import DeviceList from "@/components/devices/DeviceList";

export default function DevicesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Devices
        </h1>

        <p className="mt-1 text-muted-foreground">
          Manage and monitor all connected devices.
        </p>
      </div>

      <DeviceList />
    </div>
  );
}