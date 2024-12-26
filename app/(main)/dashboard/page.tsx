"use client";

import SalesSummary from "@/app/(main)/dashboard/components/SalesSummary";
import StockReports from "./components/StockReports";
import SalesOrder from "./components/SalesOrder";

// Rigth Sidebar
import QuickActions from "./components/QuickActions";
import FastMovingItems from "./components/FastMovingItems";

const Home = () => {
  return (
    <div className="grid xl:grid-cols-3 grid-cols-1">
      <div className="col-span-1 xl:col-span-2 space-y-8">
        <SalesSummary />
        <StockReports />
        <SalesOrder />
      </div>
      <div className="col-span-1 p-4 mx:p-8 flex xl:block items-start gap-8 flex-col-reverse sm:flex-row">
        <QuickActions />
        <FastMovingItems />
      </div>
    </div>
  );
};

export default Home;
