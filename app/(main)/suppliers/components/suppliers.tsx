// import axios
import { api } from "@/lib/axios";

import { Search, Plus /**ChevronLeft, ChevronRight**/ } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import Image from "next/image";
import { useState, useEffect } from "react";
// import { Pencil, Trash2, Eye } from "lucide-react";

// components
import { AddSupplierModal } from "./add-supplier-modal";
// import { UpdateSupplierModal } from "./update-supplier-modal";
// import { ViewSupplierModal } from "./view-supplier-modal";
// import { DeleteSupplierConfirmation } from "./delete-supplier-confirmation";
import { StatusPopup } from "@/components/global/status-popup";

// types
import { Supplier } from "@/prisma/type";

// components
import { SupplierTable } from "./supplier-table";

import { columns } from "./columns";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/suppliers");
      setSuppliers(data.data);
    } catch (err) {
      setError("Failed to load suppliers. Please try again.");
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState("");
  const [statusPopupStatus, setStatusPopupStatus] = useState<
    "success" | "error"
  >("success");

  const [loadingAddSupplier, setLoadingAddSupplier] = useState<boolean>(false);

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleAddSupplier = async (
    newSupplier: Omit<Supplier, "supplier_id" | "products">
  ) => {
    try {
      setLoadingAddSupplier(true);
      const response = await api.post("/suppliers", newSupplier);
      setLoadingAddSupplier(false);

      await fetchSuppliers(); // Refresh data after addition
      if (response.status === 201) {
        console.log("Supplier added:", response.data.data);
        showStatusPopup("Supplier added successfully", "success");
      } else {
        console.error("Unexpected response:", response);
        showStatusPopup("Unexpected response while adding supplier", "error");
      }
    } catch (error: unknown) {
      setLoadingAddSupplier(false);
      if (error instanceof Error) {
        console.error("Error adding supplier:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
      showStatusPopup("An unexpected error occurred", "error");
    }
  };

  return (
    <>
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between flex-wrap lg:flex-nowrap gap-4">
          <h2 className="text-2xl font-semibold">Suppliers</h2>
          <div className="flex gap-4 flex-wrap flex-col w-full sm:flex-row">
            <div className="flex items-center gap-4 flex-1 max-w-xl flex-nowrap flex-grow">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search" className="pl-8" />
              </div>
            </div>
            <Button
              className="bg-[#00A3FF] hover:bg-[#00A3FF]/90"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Supplier
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="relative w-full overflow-auto">
            <SupplierTable
              columns={columns}
              data={suppliers}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddSupplierModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async (supplier) => {
          await handleAddSupplier(supplier);
        }}
        loadingAddSupplier={loadingAddSupplier}
      />

      <StatusPopup
        isOpen={isStatusPopupOpen}
        onClose={() => setIsStatusPopupOpen(false)}
        message={statusPopupMessage}
        status={statusPopupStatus}
      />
    </>
  );
}
