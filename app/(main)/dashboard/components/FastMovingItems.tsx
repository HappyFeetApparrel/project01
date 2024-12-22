"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import React from "react";
import { MdOutlineNoteAdd } from "react-icons/md";

import { IconType } from "react-icons/lib";

interface fastMovingItem {
  icon: IconType;
  label?: string;
}

const fastMovingItems: fastMovingItem[] = [
  {
    icon: MdOutlineNoteAdd,
    label: "Macbook Pro",
  },
  {
    icon: MdOutlineNoteAdd,
    label: "Iphone 14 pro",
  },
  {
    icon: MdOutlineNoteAdd,
    label: "Zoom75",
  },
  {
    icon: MdOutlineNoteAdd,
    label: "Airpods Pro",
  },
  {
    icon: MdOutlineNoteAdd,
    label: "Samsung Galaxy Fold",
  },
  {
    icon: MdOutlineNoteAdd,
    label: "Samsung Odyssey",
  },
  {
    icon: MdOutlineNoteAdd,
    label: "Logitech Superlight",
  },
];

const FastMovingItems = () => {
  return (
    <div className="py-8 px-4 md:px-8 space-y-8 bg-white border">
      <h3 className="font-semibold">Fast Moving Items</h3>
      {fastMovingItems.map((item, index) => (
        <div className="flex flex-row items-center gap-2" key={index}>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="font-semibold">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default FastMovingItems;
