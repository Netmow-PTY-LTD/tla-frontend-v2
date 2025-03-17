import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import "@/styles/dashboard.css";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/super-admin/Sidebar";
import { Separator } from "@/components/ui/separator";
import DashboardHeader from "@/components/dashboard/common/DashboardHeader";
import DashboardFooter from "@/components/dashboard/common/DashboardFooter";
import Link from "next/link";

export default function SuperAdminDashboardLayout({ children }) {
  return (
    <>
      <DashboardHeader />
      <div className="flex flex-wrap">
        <main>{children}</main>
        <DashboardFooter />
      </div>
    </>
  );
}
