"use client";

import SalesSummary from "@/app/(main)/dashboard/components/SalesSummary";
import StockReports from "./components/StockReports";
import SalesOrder from "./components/SalesOrder";

// Rigth Sidebar
import QuickActions from "./components/QuickActions";
import FastMovingItems from "./components/FastMovingItems";

const Home = () => {
  return (
    <div className="flex xl:flex-row flex-col ">
      <div className="basis-9/12 space-y-8">
        <SalesSummary />
        <StockReports />
        <SalesOrder />
      </div>
      <div className="basis-3/12">
        <QuickActions />
        <FastMovingItems />
      </div>
    </div>
  );
};

export default Home;
