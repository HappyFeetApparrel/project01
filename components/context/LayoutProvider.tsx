"use client";

import React, { ReactNode, useEffect } from "react";
import { createContext, useContext, useState, useRef } from "react";

interface LayoutContextProps {
  isSidebarOpen: boolean;
  toggleSideBar: () => void;
  sidebarRef: React.RefObject<HTMLDivElement>;
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSideBar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Clean up on unmount or state change
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Close the sidebar if a click happens outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false); // Close sidebar if the click is outside
      }
    };

    if (window.innerWidth < 1024) {
      // Add event listener for clicks outside only on tablet and mobile
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <LayoutContext.Provider
      value={{ isSidebarOpen, toggleSideBar, sidebarRef }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutProvider;

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
