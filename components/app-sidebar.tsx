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

import { IconType } from "react-icons/lib";
import { RxDashboard } from "react-icons/rx";
import { BsBoxSeam } from "react-icons/bs";
import { LuShoppingCart } from "react-icons/lu";
import { CiDeliveryTruck } from "react-icons/ci";
import { AiOutlineStock } from "react-icons/ai";
import { HiUsers } from "react-icons/hi2";
import { TbTruckReturn } from "react-icons/tb";
import { MdFindReplace } from "react-icons/md";

// import { CiCircleInfo } from "react-icons/ci";
// import { IoSettingsOutline } from "react-icons/io5";
import { TbCategoryPlus } from "react-icons/tb";
import { MdOutlineBrandingWatermark } from "react-icons/md";
import { MdOutlinePayment } from "react-icons/md";

import { usePathname } from "next/navigation";
import Account from "./global/Account";

import { useLayout } from "./context/LayoutProvider";

interface SidebarMenuItem {
  id: number;
  icon: IconType;
  label: string;
  link: string;
  rolesAllowed: string[];
}

const sidebarMenuItemsGeneral: SidebarMenuItem[] = [
  {
    id: 1,
    icon: RxDashboard,
    label: "Dashboard",
    link: "/dashboard",
    rolesAllowed: ["Admin", "Manager"],
  },
  {
    id: 2,
    icon: BsBoxSeam,
    label: "Inventory",
    link: "/inventory",
    rolesAllowed: ["Admin", "Manager"],
  },
  {
    id: 3,
    icon: LuShoppingCart,
    label: "Sales Orders",
    link: "/sales-orders",
    rolesAllowed: ["Admin", "Manager", "Staff"],
  },
  {
    id: 4,
    icon: TbTruckReturn,
    label: "Returns",
    link: "/returns",
    rolesAllowed: ["Admin", "Manager"],
  },
  {
    id: 5,
    icon: MdFindReplace,
    label: "Replacements",
    link: "/replacements",
    rolesAllowed: ["Admin", "Manager"],
  },
  {
    id: 6,
    icon: CiDeliveryTruck,
    label: "Suppliers",
    link: "/suppliers",
    rolesAllowed: ["Admin", "Manager"],
  },
  {
    id: 7,
    icon: TbCategoryPlus,
    label: "Categories",
    link: "/categories",
    rolesAllowed: ["Admin", "Manager"],
  },
  {
    id: 8,
    icon: MdOutlineBrandingWatermark,
    label: "Brands",
    link: "/brands",
    rolesAllowed: ["Admin", "Manager"],
  },
  {
    id: 9,
    icon: MdOutlinePayment,
    label: "Payment Methods",
    link: "/payment-methods",
    rolesAllowed: ["Admin", "Manager"],
  },
  {
    id: 10,
    icon: AiOutlineStock,
    label: "Reports",
    link: "/reports",
    rolesAllowed: ["Admin", "Manager"],
  },
  {
    id: 11,
    icon: HiUsers,
    label: "Users",
    link: "/users",
    rolesAllowed: ["Admin"],
  },
];

// const sidebarMenuItemsSupport: SidebarMenuItem[] = [
//   {
//     id: 1,
//     icon: CiCircleInfo,
//     label: "Help",
//     link: "/help",
//     rolesAllowed: ["Admin", "Manager", "Staff"],
//   },
//   {
//     id: 2,
//     icon: IoSettingsOutline,
//     label: "Settings",
//     link: "/settings",
//     rolesAllowed: ["Admin"],
//   },
// ];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useLayout();
  const userRole = user?.user?.role;

  const filterMenuItems = (items: SidebarMenuItem[]) => {
    return items.filter(({ rolesAllowed }) =>
      rolesAllowed.includes(userRole ?? "")
    );
  };

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
              {filterMenuItems(sidebarMenuItemsGeneral).map(
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
        {/* <SidebarGroup className="flex gap-2 flex-col">
          <SidebarGroupLabel className="font-semibold uppercase text-gray-500 text-sm">
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col py-6">
            <SidebarMenu>
              {filterMenuItems(sidebarMenuItemsSupport).map(
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
        </SidebarGroup> */}
      </SidebarContent>
      <SidebarFooter className="p-8">
        <Account />
      </SidebarFooter>
    </Sidebar>
  );
}
