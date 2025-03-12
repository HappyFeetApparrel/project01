"use client";

import React from "react";
import LayoutProvider from "@/components/context/LayoutProvider";
import { Next13ProgressBar } from "next13-progressbar";

import { Toaster } from "@/components/ui/toaster"

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <LayoutProvider>
      <main className="relative bg-[#F4F5FC] justify-between gap-0">
        {children}
      </main>
      <Next13ProgressBar
        color="#ecbf19"
        startPosition={0.3}
        stopDelayMs={0}
        height="2px"
        options={{ showSpinner: false }}
        showOnShallow={true}
      />
      <Toaster />
    </LayoutProvider>
  );
};

export default Layout;
