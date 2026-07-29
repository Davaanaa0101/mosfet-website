import DeviceHeader from "@/components/device/DeviceHeader";
import DeviceStatusCard from "@/components/device/DeviceStatusCard";
import DeviceTelemetry from "@/components/device/DeviceTelemetry";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function DevicePage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="space-y-8">
      {/* Header */}
      <DeviceHeader deviceId={id} />

      {/* Status */}
      <DeviceStatusCard deviceId={id} />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DeviceTelemetry deviceId={id} />
      </div>
    </div>
  );
}