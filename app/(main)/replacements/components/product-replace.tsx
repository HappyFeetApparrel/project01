"use client";
// import axios
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AddProductModal } from "../../inventory/components/add-product-modal";
// components
import AddReplaceModal from "./add-replace-modal";
import { StatusPopup } from "@/components/global/status-popup";

import { Search, Plus /**ChevronLeft, ChevronRight**/ } from "lucide-react";
import { Input } from "@/components/ui/input";

// types
import { Product } from "@/prisma/type";

// components
import ReplaceProductTable from "./replace-product-table";
import { Button } from "@/components/ui/button";

import { columns } from "./product-columns";

import { useReplaceContext } from "../provider/replace-provider";

import { useLayout } from "@/components/context/LayoutProvider";

export default function Replaces() {
  const { saveActivity } = useLayout();
  const router = useRouter();
  const { replaces, loading, error, fetchReplaces } = useReplaceContext();
  const [addnewProduct, setAddNewProduct] = useState(false);
  const [loadingAddProduct, setLoadingAddProduct] = useState<boolean>(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState("");
  const [statusPopupStatus, setStatusPopupStatus] = useState<
    "success" | "error"
  >("success");
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [loadingAddReplace, setLoadingAddReplace] = useState<boolean>(false);

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleAddProduct = async (
    newProduct: Omit<Product, "product_id" | "order_items" | "adjustments">
  ) => {
    try {
      setLoadingAddProduct(true);
      const response = await api.post("/products", newProduct);
      setLoadingAddProduct(false);

      if (response.status === 201) {
        saveActivity("Add Product", "Product added successfully");
        showStatusPopup("Product added successfully", "success");
      } else {
        console.error("Unexpected response:", response);
        showStatusPopup("Unexpected response while adding product", "error");
      }
    } catch (error: unknown) {
      setLoadingAddProduct(false);
      if (error instanceof Error) {
        console.error("Error adding product:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
      showStatusPopup("An unexpected error occurred", "error");
    }
  };

  return (
    <>
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-semibold">Replacements</h2>
          <div className="flex gap-4 flex-wrap flex-col w-full sm:flex-row justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-xl flex-nowrap flex-grow">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search"
                  className="pl-8"
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              </div>
            </div>
            <Button
              className="bg-[#00A3FF] hover:bg-[#00A3FF]/90"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Replacement
            </Button>
          </div>
        </div>
        <ReplaceProductTable
          columns={columns}
          data={replaces}
          loading={loading}
          error={error}
          setIsAddModalOpen={() => setIsAddModalOpen(true)}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>

      {/* Modals */}
      {/* <AddReplaceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async (replace) => {
          await handleAddReplace(replace);
        }}
        loadingAddReplace={loadingAddReplace}
      /> */}
      {isAddModalOpen && (
        <AddReplaceModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          addNewProduct={addnewProduct}
          setAddNewProduct={setAddNewProduct}
        />
      )}

      <StatusPopup
        isOpen={isStatusPopupOpen}
        onClose={() => setIsStatusPopupOpen(false)}
        message={statusPopupMessage}
        status={statusPopupStatus}
      />

      <AddProductModal
        isOpen={addnewProduct}
        onClose={() => setAddNewProduct(false)}
        onAdd={async (product) => {
          await handleAddProduct(product);
        }}
        loadingAddProduct={loadingAddProduct}
      />
    </>
  );
}
