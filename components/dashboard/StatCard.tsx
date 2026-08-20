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
    <Card
      className="
        group
        overflow-hidden
        rounded-3xl
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-lg
      "
    >
      <CardContent
        className="
          relative
          flex
          items-center
          justify-between
          gap-4
          p-6
        "
      >
        {/* Subtle background decoration */}

        <div
          className="
            pointer-events-none
            absolute
            -right-8
            -top-8
            h-24
            w-24
            rounded-full
            bg-primary/5
            blur-2xl
            transition-all
            duration-500
            group-hover:scale-150
            group-hover:bg-primary/10
          "
        />

        {/* ================================================= */}
        {/* TEXT */}
        {/* ================================================= */}

        <div className="relative min-w-0">
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            {title}
          </p>

          <h2
            className="
              mt-2
              truncate
              text-3xl
              font-bold
              tracking-tight
              text-slate-900
            "
          >
            {value}
          </h2>

          {subtitle && (
            <p
              className="
                mt-1.5
                truncate
                text-xs
                text-slate-400
              "
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* ================================================= */}
        {/* ICON */}
        {/* ================================================= */}

        <div
          className="
            relative
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            border-primary/10
            bg-primary/10
            transition-all
            duration-300
            group-hover:scale-110
            group-hover:bg-primary
            group-hover:shadow-lg
            group-hover:shadow-primary/20
          "
        >
          <Icon
            className="
              h-6
              w-6
              text-primary
              transition-colors
              duration-300
              group-hover:text-primary-foreground
            "
          />
        </div>
      </CardContent>
    </Card>
  );
}