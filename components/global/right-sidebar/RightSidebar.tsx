import React from "react";

import Account from "./Account";
import { Separator } from "@/components/ui/separator";

const RightSidebar = () => {
  return (
    <div className="right-sidebar h-screen basis-[45%] lg:basis-[30%] bg-white hidden md:!block right-0 border-l-2">
      <Account />
      <Separator className="h-[2px]" />
    </div>
  );
};

export default RightSidebar;
