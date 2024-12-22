import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Account = () => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2 items-center justify-start">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <h4 className="font-semibold">Bryan Doe</h4>
          <span className="text-gray-500 text-sm">Admin</span>
        </div>
      </div>
      <div className="border rounded-sm py-0 px-3 flex items-center justify-center">
        <BsThreeDotsVertical className="w-4 h-4" />
      </div>
    </div>
  );
};

export default Account;
