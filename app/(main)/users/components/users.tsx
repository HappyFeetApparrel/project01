import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { User } from "../types/user";
import { Pencil, Trash2, Eye } from "lucide-react";

// components
import { AddUserModal } from "./add-user-modal";
import { UpdateUserModal } from "./update-user-modal";
import { ViewUserModal } from "./view-user-modal";
import { DeleteUserConfirmation } from "./delete-user-confirmation";
import { StatusPopup } from "@/components/global/status-popup";

export default function Users() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Apple",
      contactPerson: "John Doe",
      phoneNumber: "+63 123 4243",
      emailAddress: "apple@gmail.com",
      address: "123 Apple Street, Makati",
      suppliedProducts: ["MacBook", "iPhone", "iPad"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Samsung",
      contactPerson: "Jane Smith",
      phoneNumber: "+63 133 3453",
      emailAddress: "samsung@gmail.com",
      address: "456 Samsung Ave, Quezon City",
      suppliedProducts: ["Galaxy Phone", "Tablet", "TV"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Mugna Tech",
      contactPerson: "Mark Johnson",
      phoneNumber: "+63 433 4451",
      emailAddress: "logitech@gmail.com",
      address: "789 Tech Park, BGC",
      suppliedProducts: ["Laptops", "Monitors", "Keyboards"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      name: "Logitech",
      contactPerson: "Xiao Mi",
      phoneNumber: "+63 433 4531",
      emailAddress: "xiao.mi@gmail.com",
      address: "101 Logitech Road, Makati",
      suppliedProducts: ["Mice", "Keyboards", "Speakers"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "5",
      name: "Asus",
      contactPerson: "George Lee",
      phoneNumber: "+63 234 6457",
      emailAddress: "asus@gmail.com",
      address: "202 Asus Blvd, Cebu",
      suppliedProducts: ["Rog Laptop", "Motherboard", "Graphics Cards"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "6",
      name: "Lian Li",
      contactPerson: "Sarah Lee",
      phoneNumber: "+63 546 8345",
      emailAddress: "microsoft@gmail.com",
      address: "303 Lian Li Street, Davao",
      suppliedProducts: ["PC Cases", "Cooling Systems"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "7",
      name: "NZXT",
      contactPerson: "Emily Tan",
      phoneNumber: "+63 917 1033 599",
      emailAddress: "hello@mugna.tech",
      address: "404 NZXT Plaza, Makati",
      suppliedProducts: ["PC Cases", "Water Cooling"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "8",
      name: "Xiaomi",
      contactPerson: "Chris Tan",
      phoneNumber: "+63 123 3345",
      emailAddress: "lianli@gmail.com",
      address: "505 Xiaomi Street, Manila",
      suppliedProducts: ["Smartphones", "Smart Home Devices", "Laptops"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "9",
      name: "Microsoft",
      contactPerson: "Andrew Miller",
      phoneNumber: "+63 334 5673",
      emailAddress: "akko@gmail.com",
      address: "606 Microsoft Park, Taguig",
      suppliedProducts: ["Windows OS", "Surface Devices"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "10",
      name: "Sony",
      contactPerson: "Ella Cruz",
      phoneNumber: "+63 986 7465",
      emailAddress: "intel@gmail.com",
      address: "707 Sony Square, Quezon City",
      suppliedProducts: ["PlayStation", "Headphones", "Cameras"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "11",
      name: "Dell",
      contactPerson: "James Lee",
      phoneNumber: "+63 461 4677",
      emailAddress: "nvidia@gmail.com",
      address: "808 Dell Drive, Pasig",
      suppliedProducts: ["Laptops", "Monitors", "Storage Devices"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "12",
      name: "HP",
      contactPerson: "Kim Chan",
      phoneNumber: "+63 654 3245",
      emailAddress: "hp@gmail.com",
      address: "909 HP Lane, Quezon City",
      suppliedProducts: ["Printers", "Laptops", "Desktops"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "13",
      name: "Acer",
      contactPerson: "Michael B.",
      phoneNumber: "+63 998 2356",
      emailAddress: "acer@gmail.com",
      address: "1000 Acer Park, Taguig",
      suppliedProducts: ["Laptops", "Monitors", "Tablets"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "14",
      name: "Razer",
      contactPerson: "Oliver King",
      phoneNumber: "+63 777 4534",
      emailAddress: "razer@gmail.com",
      address: "1111 Razer St, Makati",
      suppliedProducts: ["Gaming Laptops", "Headsets", "Keyboards"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "15",
      name: "Corsair",
      contactPerson: "Sophia Young",
      phoneNumber: "+63 456 6543",
      emailAddress: "corsair@gmail.com",
      address: "1212 Corsair Blvd, Cebu",
      suppliedProducts: ["Memory", "Cooling Systems", "PC Accessories"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "16",
      name: "MSI",
      contactPerson: "Lucas White",
      phoneNumber: "+63 998 3678",
      emailAddress: "msi@gmail.com",
      address: "1313 MSI Road, Taguig",
      suppliedProducts: ["Gaming Laptops", "Graphics Cards", "Motherboards"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "17",
      name: "Epson",
      contactPerson: "Grace Lim",
      phoneNumber: "+63 232 3423",
      emailAddress: "epson@gmail.com",
      address: "1414 Epson Plaza, Pasig",
      suppliedProducts: ["Printers", "Projectors", "Scanners"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "18",
      name: "Canon",
      contactPerson: "Lily Huang",
      phoneNumber: "+63 876 5634",
      emailAddress: "canon@gmail.com",
      address: "1515 Canon St, Manila",
      suppliedProducts: ["Cameras", "Printers", "Scanners"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "19",
      name: "Zotac",
      contactPerson: "Anna Park",
      phoneNumber: "+63 234 6678",
      emailAddress: "zotac@gmail.com",
      address: "1616 Zotac Blvd, BGC",
      suppliedProducts: ["Graphics Cards", "Mini PCs"],
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "20",
      name: "Gigabyte",
      contactPerson: "Peter Wong",
      phoneNumber: "+63 123 7859",
      emailAddress: "gigabyte@gmail.com",
      address: "1717 Gigabyte Park, Taguig",
      suppliedProducts: ["Motherboards", "Graphics Cards", "Laptops"],
      logo: "/placeholder.svg?height=40&width=40",
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState("");
  const [statusPopupStatus, setStatusPopupStatus] = useState<
    "success" | "error"
  >("success");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const handleAddUser = (newUser: Omit<User, "id">) => {
    const supplierWithId = { ...newUser, id: Date.now().toString() };
    setUsers([...users, supplierWithId]);
    showStatusPopup("User added successfully", "success");
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map((s) => (s.id === updatedUser.id ? updatedUser : s)));
    showStatusPopup("User updated successfully", "success");
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter((s) => s.id !== selectedUser.id));
      showStatusPopup("User deleted successfully", "success");
    }
  };

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  // Paginate users
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(users.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-semibold">Users</h2>
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
              Add New User
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b transition-colors">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    User Name
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
              <tbody className="divide-y">
                {currentUsers.map((supplier) => (
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
                            setSelectedUser(supplier);
                            setIsViewModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedUser(supplier);
                            setIsUpdateModalOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedUser(supplier);
                            setIsDeleteConfirmationOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center space-x-2 py-4">
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
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
      />
      {selectedUser && (
        <>
          <UpdateUserModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            onUpdate={handleUpdateUser}
            supplier={selectedUser}
          />

          <ViewUserModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            supplier={selectedUser}
          />

          <DeleteUserConfirmation
            isOpen={isDeleteConfirmationOpen}
            onClose={() => setIsDeleteConfirmationOpen(false)}
            onConfirm={() => {
              handleDeleteUser();
              setIsDeleteConfirmationOpen(false);
            }}
            supplierName={selectedUser.name}
          />
        </>
      )}

      <StatusPopup
        isOpen={isStatusPopupOpen}
        onClose={() => setIsStatusPopupOpen(false)}
        message={statusPopupMessage}
        status={statusPopupStatus}
      />
    </>
  );
}
