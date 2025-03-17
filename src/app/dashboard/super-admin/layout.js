import React from "react";
import "@/styles/dashboard.css";
import DashboardHeader from "@/components/dashboard/common/DashboardHeader";
import DashboardFooter from "@/components/dashboard/common/DashboardFooter";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/dashboard/super-admin/NavMain";
import { data } from "@/components/dashboard/super-admin/Sidebar";

export default function SuperAdminDashboardLayout({ children }) {
  return (
    <>
      <DashboardHeader />
      <SidebarProvider>
        <Sidebar collapsible="icon" className="w-64 ">
          <SidebarHeader />
          <SidebarContent>
            <NavMain />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <div
          className="w-full "
          style={{
            minHeight: "calc(100vh - 74px)",
          }}
        >
          <div className="flex flex-col p-5 h-full">
            <div className="flex-1">{children}</div>
            <DashboardFooter />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
