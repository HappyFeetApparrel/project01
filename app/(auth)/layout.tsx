import React from "react";
import LayoutProvider from "@/components/context/LayoutProvider";

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <LayoutProvider>
      <main className="relative bg-[#F4F5FC] justify-between gap-0">
        {children}
      </main>
    </LayoutProvider>
  );
};

export default layout;
