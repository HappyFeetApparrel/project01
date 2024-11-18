import React from "react";
import LayoutProvider from "@/components/context/LayoutProvider";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import Sidebar from "@/components/global/Sidebar";

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <LayoutProvider>
      <Header />
      <main className="border-t-2 border-b-2 flex relative">
        <Sidebar />
        {children}
      </main>
      <Footer />
    </LayoutProvider>
  );
};

export default layout;
