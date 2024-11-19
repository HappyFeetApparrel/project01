import React from "react";

import { IconType } from "react-icons/lib";
import { VscGraphLine } from "react-icons/vsc";
import { FaRegCalendarAlt } from "react-icons/fa";
import { CiDollar } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";

interface SalesSummaryProps {
  icon: IconType;
  iconColorBG: string;
  iconColor: string;
  amount: string;
  title: string;
}

const salesSummary: SalesSummaryProps[] = [
  {
    icon: VscGraphLine,
    iconColorBG: "bg-cyan-50",
    iconColor: "text-cyan-500",
    amount: "143.3k",
    title: "Total Orders",
  },
  {
    icon: FaRegCalendarAlt,
    iconColorBG: "bg-violet-50",
    iconColor: "text-violet-500",
    amount: "$ 250,423",
    title: "Revenue",
  },
  {
    icon: CiDollar,
    iconColorBG: "bg-orange-50",
    iconColor: "text-orange-500",
    amount: "$68.9k",
    title: "Page Views",
  },
  {
    icon: IoBagOutline,
    iconColorBG: "bg-red-50",
    iconColor: "text-red-500",
    amount: "343",
    title: "New Customers",
  },
];

const SalesSummary = () => {
  return (
    <div className="py-16 px-4 md:px-8 space-y-8">
      <h3 className="font-semibold">Sales Summary</h3>
      <div className="container mx-auto grid grid-cols-2 gap-4 2xl:grid-cols-4">
        {salesSummary.map((item, index) => (
          <div
            key={index}
            className="flex py-3 px-5 lg:py-6 lg:px-10 bg-white shadow-lg rounded-lg gap-4 items-center"
          >
            <div
              className={`${item.iconColor} ${item.iconColorBG} p-2.5 rounded-full`}
            >
              <item.icon className=" w-5 h-5 " />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-gray-500">{item.amount}</h3>
              <p className="text-gray-500">{item.title} </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesSummary;
