"use client";

import React from "react";
import SalesDashboard from "./components/sales-dashboard";

// right sidebar
import QuickActions from "../dashboard/components/QuickActions";
import RecentActivity from "@/components/global/RecentActivity";

const page = () => {
  return (
    <div className="py-16 px-8 space-y-8 grid grid-cols-1 xl:grid-cols-3">
      <div className="p-6 space-y-6 col-span-1 xl:col-span-2">
        <SalesDashboard />
      </div>
      <div className="col-span-1">
        <QuickActions />
        <RecentActivity />
      </div>
    </div>
  );
};

export default page;
