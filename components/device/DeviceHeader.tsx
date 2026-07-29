"use client";

import { useDevice } from "@/hooks/useDevice";
import { Badge } from "@/components/ui/badge";

interface Props {
  deviceId: string;
}

export default function DeviceHeader({ deviceId }: Props) {
  const { data, isLoading } = useDevice(deviceId);

  if (isLoading) {
    return <div>Loading device...</div>;
  }

  if (!data) {
    return <div>Device not found.</div>;
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">
          {data.name}
        </h1>

        <p className="text-muted-foreground">
          {data.location}
        </p>
      </div>

      <Badge
        variant={
          data.status === "online"
            ? "default"
            : "secondary"
        }
      >
        {data.status}
      </Badge>
    </div>
  );
}