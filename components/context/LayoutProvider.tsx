"use client";
import React, { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface LayoutContextProps {
  isSidebarOpen: boolean;
  toggleSideBar: () => void;
  user: Session | null;
  setUser: (user: Session | null) => void;
}

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

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

const LayoutProvider: React.FC<{
  session?: Session | null;
  children: ReactNode;
}> = ({ session, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [user, setUser] = useState<Session | null>(null);
  // const pathname = usePathname();
  const toggleSideBar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (session) {
      setUser(session);
    }
  }, [session]);

  return (
    <LayoutContext.Provider
      value={{ isSidebarOpen, toggleSideBar, user, setUser }}
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
