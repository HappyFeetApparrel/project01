"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

// icons
import { IconType } from "react-icons/lib";
import { RxDashboard } from "react-icons/rx";
import { BsBoxSeam } from "react-icons/bs";
import { LuShoppingCart } from "react-icons/lu";
import { CiDeliveryTruck } from "react-icons/ci";
import { AiOutlineStock } from "react-icons/ai";

import { CiCircleInfo } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";

import { usePathname } from "next/navigation";
import Account from "./global/Account";

interface SidebarMenuItem {
  id: number;
  icon: IconType;
  label: string;
  link: string;
}

const sidebarMenuItemsGeneral: SidebarMenuItem[] = [
  { id: 1, icon: RxDashboard, label: "Dashboard", link: "/dashboard" },
  { id: 2, icon: BsBoxSeam, label: "Inventory", link: "/inventory" },
  { id: 3, icon: LuShoppingCart, label: "Sales Orders", link: "/sales-orders" },
  { id: 4, icon: CiDeliveryTruck, label: "Suppliers", link: "/suppliers" },
  { id: 5, icon: AiOutlineStock, label: "Reports", link: "/reports" },
];

const sidebarMenuItemsSupport: SidebarMenuItem[] = [
  { id: 1, icon: CiCircleInfo, label: "Help", link: "/help" },
  { id: 2, icon: IoSettingsOutline, label: "Settings", link: "/settings" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="pt-8 px-8 justify-center">
        <Link href="/">
          <Image src="/logo.png" alt="" width={75} height={36} />
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-8 container mx-auto">
        <SidebarGroup className="flex gap-2 flex-col">
          <SidebarGroupLabel className="font-semibold uppercase text-gray-500 text-sm">
            General
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col py-6">
            <SidebarMenu>
              {sidebarMenuItemsGeneral.map(
                ({ id, icon: Icon, label, link }) => (
                  <Link
                    href={link}
                    className={`flex items-center gap-2 p-3 hover:bg-primary/80 hover:text-white hover:font-semibold hover:rounded-md transition-all ${
                      pathname == link
                        ? "bg-primary/80 text-white font-semibold rounded-md"
                        : ""
                    }`}
                    key={id}
                  >
                    <Icon />
                    <span className="whitespace-nowrap">{label}</span>
                  </Link>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="flex gap-2 flex-col">
          <SidebarGroupLabel className="font-semibold uppercase text-gray-500 text-sm">
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col py-6">
            <SidebarMenu>
              {sidebarMenuItemsSupport.map(
                ({ id, icon: Icon, label, link }) => (
                  <Link
                    href={link}
                    className={`flex items-center gap-2 p-3 hover:bg-primary/80 hover:text-white hover:font-semibold hover:rounded-md transition-all`}
                    key={id}
                  >
                    <Icon />
                    <span className="whitespace-nowrap">{label}</span>
                  </Link>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-8">
        <Account />
      </SidebarFooter>
    </Sidebar>
  );
}
