"use client";

import React from "react";
import Reports from "./components/reports";

// right sidebar
import SupplierAnalytics from "@/components/supplier-analytics";

const page = () => {
  return (
    <div className="py-16 px-8 space-y-8 grid grid-cols-1 xl:grid-cols-3">
      <div className="p-6 space-y-6 col-span-1 xl:col-span-2">
        <Reports />
      </div>
      <div className="col-span-1">
        <SupplierAnalytics />
      </div>
    </div>
  );
};

export default page;
