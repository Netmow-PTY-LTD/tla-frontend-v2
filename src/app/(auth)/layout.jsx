import DashboardFooter from "@/components/dashboard/common/DashboardFooter";
import DashboardHeader from "@/components/dashboard/common/DashboardHeader";
import SideNav from "@/components/dashboard/common/SideNav";
import React from "react";
import "../../styles/dashboard.css";
import AuthHeader from "@/components/auth/AuthHeader";

export default function AuthLayout({ children }) {
  return (
    <>
      <AuthHeader />
      <main className="main-content">{children}</main>
    </>
  );
}
