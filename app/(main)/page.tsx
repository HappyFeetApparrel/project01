"use client";

import React from "react";

import SalesSummary from "@/app/(main)/components/SalesSummary";
import StockReports from "./components/StockReports";
import SalesOrder from "./components/SalesOrder";

const Home = () => {
  return (
    <div className="container mx-auto">
      <SalesSummary />
      <StockReports />
      <SalesOrder />
    </div>
  );
};

export default Home;
