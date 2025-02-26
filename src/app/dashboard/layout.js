import DashboardFooter from "@/components/dashboard/common/DashboardFooter";
import DashboardHeader from "@/components/dashboard/common/DashboardHeader";
import SideNav from "@/components/dashboard/common/SideNav";
import React from "react";
import "../../styles/dashboard.css";

export default function DashboardLayout({ children }) {
  return (
    <>
      <DashboardHeader />
      <div className="flex">
        <div className="sidebar-wrapper">
          <SideNav />
        </div>
        <main className="main-content">
          {children}
          <DashboardFooter />
        </main>
      </div>
    </>
  );
}
