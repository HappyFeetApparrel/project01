"use client";
import React from "react";
import { Next13ProgressBar } from "next13-progressbar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import LayoutProvider from "@/components/context/LayoutProvider";
import { AppSidebar } from "@/components/app-sidebar";
import Footer from "@/components/global/Footer";
import Search from "@/components/global/Search";

import { getSession } from "next-auth/react"; // ✅ Correct import for client-side session
import { signOut } from "next-auth/react";

interface Session {
  user: {
    id: string;
    token: string;
    uuid: string;
    role: string;
    name: string;
    email: string;
  };
}

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [session, setSession] = React.useState<Session | null>(null);

  React.useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession(); // ✅ Client-side session fetching
      if (!sessionData) {
        signOut(); // Sign out if no session
      } else {
        setSession(sessionData as Session);
      }
    };
    fetchSession();
  }, []);

  return (
    <LayoutProvider session={session}>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col flex-grow ">
          <header className="flex items-center justify-between px-4 py-2 flex-row gap-8 md:flex-row-reverse bg-white border-b sticky top-0 z-10">
            <Search />
            <SidebarTrigger className="flex" />
          </header>

          <main className="flex-grow bg-primary-foreground">
            {children}
            <Footer />
          </main>
        </div>
      </SidebarProvider>
      <Next13ProgressBar
        color="#ecbf19"
        startPosition={0.3}
        stopDelayMs={0}
        height="2px"
        options={{ showSpinner: false }}
        showOnShallow={true}
      />
    </LayoutProvider>
  );
};

export default Layout;
