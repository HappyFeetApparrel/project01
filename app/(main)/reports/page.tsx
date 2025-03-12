"use client";

import React from "react";
import Reports from "./components/reports";
import DefectSalesReport from "./components/defect-report";
import ReportPerCategory from "./components/report-per-category";

// right sidebar
import SupplierAnalytics from "@/components/supplier-analytics";
import SalesReport from "../sales-orders/components/sales-report";

const page = () => {
  return (
    <div className="py-16 px-8 space-y-8 grid grid-cols-1 xl:grid-cols-3">
      <div className="p-0 lg:p-6 space-y-6 col-span-1 xl:col-span-2">
        <Reports />
        <DefectSalesReport />
        <ReportPerCategory />

      </div>
      <div className="col-span-1 p-0 lg:px-4 mx:px-8">
        <SupplierAnalytics />
      </div>
    </div>
  );
};

export default page;
