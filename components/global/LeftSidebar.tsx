"use client";

import React from "react";
import Link from "next/link";

import { useLayout } from "../context/LayoutProvider";

// icons
import { IconType } from "react-icons/lib";
import { RxDashboard } from "react-icons/rx";
import { BsBoxSeam } from "react-icons/bs";
import { LuShoppingCart } from "react-icons/lu";
import { CiDeliveryTruck } from "react-icons/ci";
import { AiOutlineStock } from "react-icons/ai";

import { CiCircleInfo } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";

interface SidebarMenuItem {
  id: number;
  icon: IconType;
  label: string;
  link: string;
}

const sidebarMenuItemsGeneral: SidebarMenuItem[] = [
  { id: 1, icon: RxDashboard, label: "Dashboard", link: "/" },
  { id: 2, icon: BsBoxSeam, label: "Inventory", link: "/inventory" },
  { id: 3, icon: LuShoppingCart, label: "Sales Orders", link: "/sales-orders" },
  { id: 4, icon: CiDeliveryTruck, label: "Suppliers", link: "/suppliers" },
  { id: 5, icon: AiOutlineStock, label: "Reports", link: "/reports" },
];

const sidebarMenuItemsSupport: SidebarMenuItem[] = [
  { id: 1, icon: CiCircleInfo, label: "Help", link: "/help" },
  { id: 2, icon: IoSettingsOutline, label: "Settings", link: "/settings" },
];

const LeftSidebar = () => {
  const { isSidebarOpen, sidebarRef } = useLayout();

  return (
    <div
      className={`h-screen p-16 basis-[20%] bg-[#F4F5FC] hidden xl:!block xl:static fixed left-0 ${
        isSidebarOpen ? "!block" : "!hidden"
      }`}
      ref={sidebarRef} // Reference the sidebar to detect clicks outside
    >
      <div className="container mx-auto">
        <div className="flex gap-2 flex-col">
          <p className="font-semibold uppercase text-gray-500 text-sm">
            General
          </p>
          <div className="flex flex-col py-6">
            {sidebarMenuItemsGeneral.map(({ id, icon: Icon, label, link }) => (
              <Link
                href={link}
                className={`flex items-center gap-2 p-3 hover:bg-primary/80 hover:text-white hover:font-semibold hover:rounded-md transition-all`}
                key={id}
              >
                <Icon />
                <span className="whitespace-nowrap">{label}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex gap-2 flex-col">
          <p className="font-semibold uppercase text-gray-500 text-sm">
            Support
          </p>
          <div className="flex flex-col py-6">
            {sidebarMenuItemsSupport.map(({ id, icon: Icon, label, link }) => (
              <Link
                href={link}
                className={`flex items-center gap-2 p-3 hover:bg-primary/80 hover:text-white hover:font-semibold hover:rounded-md transition-all`}
                key={id}
              >
                <Icon />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
