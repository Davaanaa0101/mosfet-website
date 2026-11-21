import {
  LayoutDashboard,
  Cpu,
  FolderKanban,
  ChartColumn,
  Bell,
  Settings,
  User,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Хяналтын самбар",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Төхөөрөмжүүд",
    href: "/dashboard/devices",
    icon: Cpu,
  },
  {
    title: "Дохиолол",
    href: "/dashboard/alerts",
    icon: Bell,
  },
  {
    title: "Тохиргоо",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Профайл",
    href: "/dashboard/profile",
    icon: User,
  },
];