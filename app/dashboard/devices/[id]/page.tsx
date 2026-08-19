import DeviceHeader from "@/components/device/DeviceHeader";
import DeviceStatusCard from "@/components/device/DeviceStatusCard";
import DeviceTelemetry from "@/components/device/DeviceTelemetry";
import SensorGrid from "@/components/device/SensorGrid";

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
    <div className="space-y-8">
      <DeviceHeader deviceId={id} />

      <DeviceStatusCard deviceId={id} />

      <SensorGrid deviceId={id} />

      <DeviceTelemetry deviceId={id} />
    </div>
  );
}