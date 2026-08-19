"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type {
  LucideIcon,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-primary/10 p-4">
          <Icon className="h-7 w-7 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}