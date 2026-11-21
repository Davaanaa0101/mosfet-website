import DeviceList from "@/components/devices/DeviceList";

export default function DevicesPage() {
  return (
    <div className="mosfet-glass-page relative isolate space-y-8 rounded-[28px] bg-[#07111F] p-4 text-slate-100 sm:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Devices
        </h1>

        <p className="mt-1 text-slate-400">
          Manage and monitor all connected devices.
        </p>
      </div>

      <DeviceList />
    </div>
  );
}