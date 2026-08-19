import DeviceHeader from "@/components/device/DeviceHeader";
import DeviceStatusCard from "@/components/device/DeviceStatusCard";
import DeviceTelemetry from "@/components/device/DeviceTelemetry";

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
      {/* Device Header */}
      <DeviceHeader deviceId={id} />

      {/* Live Status */}
      <DeviceStatusCard deviceId={id} />

      {/* Telemetry Charts */}
      <DeviceTelemetry deviceId={id} />
    </div>
  );
}