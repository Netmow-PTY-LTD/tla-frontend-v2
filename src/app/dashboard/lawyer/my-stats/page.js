import StatusCard from "@/components/dashboard/lawyer-dashboard/components/StatusCard";
import ProfileCard from "@/components/dashboard/lawyer-dashboard/module/MyStats/ProfileCard";
import { Card } from "@/components/ui/card";

import React from "react";

const MyStatsPage = () => {
  const menuLinks = [
    { label: "All Time", href: "#/all-time" },
    { label: "Today", href: "#/today" },
    { label: "This Week", href: "#/this-week" },
    { label: "This Month", href: "#/this-month" },
  ];

  return (
    <div>
      <h1 className="font-bold text-2xl border-b-2 text-[#0B1C2D] ">
        Overview of Your Stats
      </h1>

      <div className="mt-5 flex gap-5">
        <div className="w-1/3">
          <ProfileCard />
        </div>
        <div className="w-1/3">
          <div className="flex gap-8">
            <StatusCard status="pending" count={24} menuItems={menuLinks} />
            <StatusCard status="hired" count={24} menuItems={menuLinks} />
          </div>
        </div>
        <div className="w-1/3">
          <Card></Card>
        </div>
      </div>
    </div>
  );
};

export default MyStatsPage;
