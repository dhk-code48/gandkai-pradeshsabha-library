"use client";

import { BarChart, Book, BookCheck, Grid, Info, Layout, ReceiptText, Users } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { FC } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const SidebarRoutes: FC = () => {
  const superAdminRoutes = [
    {
      icon: Layout,
      href: `/dashboard`,
      label: "Dashboard",
    },
    {
      icon: ReceiptText,
      href: `/dashboard/issueRecords`,
      label: "Issue Book",
    },
    {
      icon: BookCheck,
      href: `/dashboard/returnRecords`,
      label: "Return Record",
    },
    {
      icon: Book,
      href: `/dashboard/books`,
      label: "Books",
    },
    {
      icon: Grid,
      href: `/dashboard/shelves`,
      label: "Shelves",
    },
    {
      icon: Users,
      href: `/dashboard/members`,
      label: "Members",
    },
    {
      icon: BarChart,
      href: `/dashboard/reports`,
      label: "Reports",
    },
  ];

  // const pathname = usePathname();

  return (
    <div className="flex flex-col w-full gap-y-1">
      {superAdminRoutes.map((route) => (
        <SidebarItem href={route.href} icon={route.icon} label={route.label} key={route.label} />
      ))}
      <Link
        target="_blank"
        href={"/user-manual-admin.pdf"}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900  transition-all hover:text-gray-900  dark:text-gray-50 dark:hover:text-gray-50"
        )}
      >
        <Info className="w-4 h-4" />
        User Manual
      </Link>
    </div>
  );
};
