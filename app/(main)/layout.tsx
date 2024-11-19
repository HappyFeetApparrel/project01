import React from "react";
import LayoutProvider from "@/components/context/LayoutProvider";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import LeftSidebar from "@/components/global/LeftSidebar";
import RightSidebar from "@/components/global/right-sidebar/RightSidebar";

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <LayoutProvider>
      <Header />
      <main className="border-t-2 border-b-2 flex relative bg-[#F4F5FC] justify-between gap-0">
        <LeftSidebar />
        {children}
        <RightSidebar />
      </main>
      <Footer />
    </LayoutProvider>
  );
};

export default layout;
