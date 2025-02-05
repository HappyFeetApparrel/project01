"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        <div className="border rounded-sm py-0 px-3 flex items-center justify-center cursor-pointer">
          <BsThreeDotsVertical className="w-4 h-4" />
        </div>

        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md hidden group-hover:block">
          <button
            onClick={() => {
              nProgress.start();
              signOut({ callbackUrl: "/" });
            }}
            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
