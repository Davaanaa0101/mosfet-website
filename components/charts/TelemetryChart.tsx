"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";



interface Props {
  title: string;
  data: any[];
  dataKey: string;
  unit?: string;
}

export default function TelemetryChart({
  title,
  data,
  dataKey,
  unit,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="createdAt"
                tickFormatter={(value) =>
                  new Date(value).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
              />

              <Tooltip
  formatter={(value) => {
    if (value == null) {
      return ["--", title];
    }

    return [unit ? `${value} ${unit}` : String(value), title];
  }}
  labelFormatter={(label) => {
    if (!label) return "";

    return new Date(String(label)).toLocaleString();
  }}
/>

              <Line
                type="monotone"
                dataKey={dataKey}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}