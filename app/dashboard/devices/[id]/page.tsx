import DeviceHeader from "@/components/device/DeviceHeader";
import DeviceStatusCard from "@/components/device/DeviceStatusCard";
import DeviceTelemetry from "@/components/device/DeviceTelemetry";
import DeviceConfiguration from "@/components/device/DeviceConfiguration";
import SensorGrid from "@/components/device/SensorGrid";
import DeviceElectricityCost from "@/components/device/DeviceElectricityCost";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function DevicePage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <div className="mosfet-glass-page relative isolate space-y-8 rounded-[28px] bg-[#07111F] p-4 text-slate-100 sm:p-6">
      <DeviceHeader deviceId={id} />

      <DeviceStatusCard deviceId={id} />

      <SensorGrid deviceId={id} />

      <DeviceElectricityCost deviceId={id} />

      <DeviceConfiguration
        deviceId={id}
      />

      <DeviceTelemetry deviceId={id} />
    </div>
  );
}