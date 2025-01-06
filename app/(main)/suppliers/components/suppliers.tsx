import { Search, Plus /**ChevronLeft, ChevronRight**/ } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import Image from "next/image";
import { useState } from "react";
// import { Pencil, Trash2, Eye } from "lucide-react";

// components
// import { AddSupplierModal } from "./add-supplier-modal";
// import { UpdateSupplierModal } from "./update-supplier-modal";
// import { ViewSupplierModal } from "./view-supplier-modal";
// import { DeleteSupplierConfirmation } from "./delete-supplier-confirmation";
// import { StatusPopup } from "@/components/global/status-popup";

// types
// import { Supplier } from "@/prisma/type";

export default function Suppliers() {
  // const [suppliers, setSuppliers] = useState<Supplier[]>();

  // const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  // const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  // const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
  useState(false);
  // const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  // const [statusPopupMessage, setStatusPopupMessage] = useState("");
  // const [statusPopupStatus, setStatusPopupStatus] = useState<
  // "success" | ("error" > "success");
  // const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
  //   null
  // );

  // Pagination state
  // const [currentPage, setCurrentPage] = useState(1);
  // const rowsPerPage = 5;

  // const handleAddSupplier = (newSupplier: Omit<Supplier, "id">) => {
  //   const supplierWithId = { ...newSupplier, id: Date.now().toString() };
  //   setSuppliers([...suppliers, supplierWithId]);
  //   showStatusPopup("Supplier added successfully", "success");
  // };

  // const handleUpdateSupplier = (updatedSupplier: Supplier) => {
  //   setSuppliers(
  //     suppliers.map((s) => (s.id === updatedSupplier.id ? updatedSupplier : s))
  //   );
  //   showStatusPopup("Supplier updated successfully", "success");
  // };

  // const handleDeleteSupplier = () => {
  //   if (selectedSupplier) {
  //     setSuppliers(suppliers.filter((s) => s.id !== selectedSupplier.id));
  //     showStatusPopup("Supplier deleted successfully", "success");
  //   }
  // };

  // const showStatusPopup = (message: string, status: "success" | "error") => {
  //   setStatusPopupMessage(message);
  //   setStatusPopupStatus(status);
  //   setIsStatusPopupOpen(true);
  // };

  // Paginate suppliers
  // const startIndex = (currentPage - 1) * rowsPerPage;
  // const currentSuppliers = suppliers.slice(
  //   startIndex,
  //   startIndex + rowsPerPage
  // );
  // const totalPages = Math.ceil(suppliers.length / rowsPerPage);

  // const handlePageChange = (page: number) => {
  //   if (page > 0 && page <= totalPages) {
  //     setCurrentPage(page);
  //   }
  // };

  return (
    <>
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
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
              // onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Supplier
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b transition-colors">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Supplier Name
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Contact No.
                  </th>
                  <th className="h-12 px-4 text-right align-middle"></th>
                </tr>
              </thead>
              {/* <tbody className="divide-y">
                {currentSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={supplier.logo}
                          alt={supplier.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <span className="font-medium">{supplier.name}</span>
                      </div>
                    </td>
                    <td className="p-4">{supplier.emailAddress}</td>
                    <td className="p-4">{supplier.contactPerson}</td>
                    <td className="p-4 text-right">
                      <Button variant="link" className="text-[#00A3FF]">
                        Order History
                      </Button>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setIsViewModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setIsUpdateModalOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setIsDeleteConfirmationOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody> */}
            </table>
          </div>

          {/* Pagination Controls */}
          {/* <div className="flex items-center justify-center space-x-2 py-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={
                  currentPage === index + 1 ? "bg-[#00A3FF] text-white" : ""
                }
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div> */}
        </div>
      </div>

      {/* Modals */}
      {/* <AddSupplierModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSupplier}
      /> */}
      {/* {selectedSupplier && (
        <>
          <UpdateSupplierModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            onUpdate={handleUpdateSupplier}
            supplier={selectedSupplier}
          />

          <ViewSupplierModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            supplier={selectedSupplier}
          />

          <DeleteSupplierConfirmation
            isOpen={isDeleteConfirmationOpen}
            onClose={() => setIsDeleteConfirmationOpen(false)}
            onConfirm={() => {
              handleDeleteSupplier();
              setIsDeleteConfirmationOpen(false);
            }}
            supplierName={selectedSupplier.name}
          />
        </>
      )} */}

      {/* <StatusPopup
        isOpen={isStatusPopupOpen}
        onClose={() => setIsStatusPopupOpen(false)}
        message={statusPopupMessage}
        status={statusPopupStatus}
      /> */}
    </>
  );
}
