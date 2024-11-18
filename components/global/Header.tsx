"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "./Search";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiCloseLargeFill } from "react-icons/ri";

import { useLayout } from "../context/LayoutProvider";

const Header = () => {
  const { isSidebarOpen, toggleSideBar } = useLayout();

  return (
    <header className="container mx-auto">
      <div className="flex justify-between items-center p-5 flex-nowrap">
        <div className="right-header">
          <Link href="/">
            <Image src="/logo.svg" alt="" width={136} height={36} />
          </Link>
        </div>
        <div className="left-header flex justify-end items-stretch gap-x-4">
          <Search />
          <div
            className="p-1.5 shadow-md text-gray-500 transition-all border rounded-sm lg:hidden hover:bg-primary/80 hover:text-white cursor-pointer"
            onClick={toggleSideBar}
          >
            {isSidebarOpen ? (
              <RiCloseLargeFill className="text-inherit w-5 h-5 " />
            ) : (
              <RxHamburgerMenu className="text-inherit w-5 h-5 " />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
