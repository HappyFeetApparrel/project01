"use client";

import React, { useEffect, useState } from "react";
import { IconType } from "react-icons/lib";
import { VscGraphLine } from "react-icons/vsc"; // Correct import for VscGraphLine
import { FaRegCalendarAlt } from "react-icons/fa"; // Correct import for FaRegCalendarAlt
import { CiDollar } from "react-icons/ci"; // Correct import for CiDollar
import { IoBagOutline } from "react-icons/io5"; // Correct import for IoBagOutline

// Define the structure of the response data
interface SalesSummaryData {
  icon: IconType;
  iconColorBG: string;
  iconColor: string;
  amount: string;
  title: string;
}

const SalesSummary = () => {
  const [salesData, setSalesData] = useState<SalesSummaryData[]>([]);

  // Fetch data from the 'dashboard-summary' API
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("/api/dashboard-summary");
        if (response.ok) {
          const data = await response.json();
          setSalesData(data.data); // Assuming the data is under 'data' key in response
        } else {
          console.error("Failed to fetch sales data");
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <div className="py-16 px-4 md:px-8 space-y-8">
      <h3 className="font-semibold">Sales Summary</h3>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:grid-cols-4">
        {salesData &&
          salesData.map((item, index) => (
            <div
              key={index}
              className="flex py-3 px-5 lg:p-5 bg-white shadow-lg rounded-lg gap-4 items-center group hover:shadow-xl transition-all duration-300 hover:bg-primary-foreground cursor-pointer"
            >
              <div
                className={`${item.iconColor} ${item.iconColorBG} p-2.5 rounded-full`}
              >
                {/* <item.icon className="w-5 h-5" /> */}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-gray-500">{item.amount}</h3>
                <p className="text-gray-500">{item.title}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SalesSummary;
