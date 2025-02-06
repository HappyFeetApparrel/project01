"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { IoMdLogOut } from "react-icons/io";

import { useLayout } from "../context/LayoutProvider";
import nProgress from "nprogress";

const Account = () => {
  const { user } = useLayout();

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <h4 className="font-semibold">{user.user.name}</h4>
          <span className="text-gray-500 text-sm capitalize">
            {user.user.role}
          </span>
        </div>
      </div>

      <div className="relative group">
        <div
          className=" rounded-sm py-0 px-3 flex items-center justify-center cursor-pointer"
          title="Logout"
        >
          <IoMdLogOut
            className="w-6 h-6 hover:fill-red-500"
            onClick={() => {
              nProgress.start();
              signOut({ callbackUrl: "/" });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Account;
