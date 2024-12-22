"use client";

import React from "react";
import { MdOutlineNoteAdd } from "react-icons/md";
import { FaBox } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { CiExport } from "react-icons/ci";

import { IconType } from "react-icons/lib";

interface quickActionItem {
  icon: IconType;
  onClick: () => void;
  shortcut?: string;
  label?: string;
}

const quickActionItems: quickActionItem[] = [
  {
    icon: MdOutlineNoteAdd,
    onClick: () => {},
    shortcut: "ctrl + n",
    label: "Create Order",
  },
  {
    icon: FaBox,
    onClick: () => {},
    shortcut: "ctrl + n",
    label: "Create Order",
  },
  {
    icon: FaTruck,
    onClick: () => {},
    shortcut: "ctrl + n",
    label: "Create Order",
  },
  {
    icon: CiExport,
    onClick: () => {},
    shortcut: "ctrl + n",
    label: "Create Order",
  },
];

const QuickActions = () => {
  return (
    <div className="py-8 px-4 md:px-8 space-y-8 bg-white border">
      <h3 className="font-semibold">Quick Actions</h3>
      {quickActionItems.map((item, index) => (
        <button
          className="container mx-auto flex flex-row justify-between text-gray-500 flex-wrap gap-2"
          key={index}
          onClick={item.onClick}
        >
          <div className="flex flex-row items-center gap-2">
            <item.icon className="flex-grow size-5" />
            <p className="font-semibold">{item.label}</p>
          </div>
          <span className="font-regular">{item.shortcut}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
