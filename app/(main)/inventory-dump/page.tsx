"use client";

// components
// import { AddProductDialog } from "./components/add-product-dialog";

// right sidebar
import QuickActions from "../dashboard/components/QuickActions";
import RecentActivity from "@/components/global/RecentActivity";

import Products from "./components/products";

const InventoryPage = () => {
  return (
    <div className="py-16 px-8 space-y-8 grid grid-cols-1 xl:grid-cols-3">
      <div className="p-6 space-y-6 col-span-1 xl:col-span-2">
        <Products />
      </div>
      <div className="col-span-1 p-4 mx:p-8 flex xl:block items-start gap-8 flex-col-reverse sm:flex-row">
        <QuickActions />
        <RecentActivity />
      </div>
      {/* <AddProductDialog open={open} setOpen={setOpen} /> */}
    </div>
  );
};

export default InventoryPage;
