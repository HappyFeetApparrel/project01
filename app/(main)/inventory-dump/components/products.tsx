// import axios
import { api } from "@/lib/axios";

import { Search, Plus /**ChevronLeft, ChevronRight**/ } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import Image from "next/image";
import { useState, useEffect } from "react";
// import { Pencil, Trash2, Eye } from "lucide-react";

// components
// import { AddProductModal } from "./add-product-modal";
// import { UpdateProductModal } from "./update-product-modal";
// import { ViewProductModal } from "./view-product-modal";
// import { DeleteProductConfirmation } from "./delete-product-confirmation";
// import { StatusPopup } from "@/components/global/status-popup";

// types
import { Product } from "@/prisma/type";

// components
import { ProductTable } from "./product-table";

import { columns } from "./columns";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data.data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  //   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  //   const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  //   const [statusPopupMessage, setStatusPopupMessage] = useState("");
  //   const [statusPopupStatus, setStatusPopupStatus] = useState<
  //     "success" | "error"
  //   >("success");

  //   const [loadingAddProduct, setLoadingAddProduct] = useState<boolean>(false);

  //   const showStatusPopup = (message: string, status: "success" | "error") => {
  //     setStatusPopupMessage(message);
  //     setStatusPopupStatus(status);
  //     setIsStatusPopupOpen(true);
  //   };

  //   const handleAddProduct = async (
  //     newProduct: Omit<Product, "product_id" | "products">
  //   ) => {
  //     try {
  //       setLoadingAddProduct(true);
  //       const response = await api.post("/products", newProduct);
  //       setLoadingAddProduct(false);

  //       await fetchProducts(); // Refresh data after addition
  //       if (response.status === 200) {
  //         console.log("Product added:", response.data.data);
  //         showStatusPopup("Product added successfully", "success");
  //       } else {
  //         console.error("Unexpected response:", response);
  //         showStatusPopup("Unexpected response while adding product", "error");
  //       }
  //     } catch (error: unknown) {
  //       setLoadingAddProduct(false);
  //       if (error instanceof Error) {
  //         console.error("Error adding product:", error.message);
  //       } else {
  //         console.error("An unknown error occurred:", error);
  //       }
  //       showStatusPopup("An unexpected error occurred", "error");
  //     }
  //   };

  return (
    <>
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between flex-wrap lg:flex-nowrap gap-4">
          <h2 className="text-2xl font-semibold">Products</h2>
          <div className="flex gap-4 flex-wrap flex-col w-full sm:flex-row">
            <div className="flex items-center gap-4 flex-1 max-w-xl flex-nowrap flex-grow">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search" className="pl-8" />
              </div>
            </div>
            <Button
              className="bg-[#00A3FF] hover:bg-[#00A3FF]/90"
              //   onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="relative w-full overflow-auto">
            <ProductTable
              columns={columns}
              data={products}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async (product) => {
          await handleAddProduct(product);
        }}
        loadingAddProduct={loadingAddProduct}
      />

      <StatusPopup
        isOpen={isStatusPopupOpen}
        onClose={() => setIsStatusPopupOpen(false)}
        message={statusPopupMessage}
        status={statusPopupStatus}
      /> */}
    </>
  );
}
