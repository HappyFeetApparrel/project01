"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import React from "react";

const Main = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>{children}</main>
    </SidebarProvider>
  );
};

export default Main;
