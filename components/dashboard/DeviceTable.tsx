"use client";

import { useDevices } from "@/hooks/useDevices";

export default function DeviceTable() {
  const { data, isLoading, error } = useDevices();

  if (isLoading) {
    return <div>Loading devices...</div>;
  }

  if (error) {
    return <div>Failed to load devices.</div>;
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 text-left">Device ID</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((device) => (
            <tr key={device._id} className="border-t">
              <td className="p-3">{device.deviceId}</td>
              <td className="p-3">{device.name}</td>
              <td className="p-3">{device.type}</td>
              <td className="p-3">{device.location}</td>
              <td className="p-3">
                <span
                  className={
                    device.status === "online"
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {device.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}