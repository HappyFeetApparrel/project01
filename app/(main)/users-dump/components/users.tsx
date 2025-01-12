// import axios
import { api } from "@/lib/axios";

import { Search, Plus /**ChevronLeft, ChevronRight**/ } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import Image from "next/image";
import { useState, useEffect } from "react";
// import { Pencil, Trash2, Eye } from "lucide-react";

// components
// import { AddUserModal } from "./add-user-modal";
// import { UpdateUserModal } from "./update-user-modal";
// import { ViewUserModal } from "./view-user-modal";
// import { DeleteUserConfirmation } from "./delete-user-confirmation";
// import { StatusPopup } from "@/components/global/status-popup";

// types
import { User } from "@/prisma/type";

// components
import { UserTable } from "./user-table";

import { columns } from "./columns";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data.data);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  // const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  // const [statusPopupMessage, setStatusPopupMessage] = useState("");
  // const [statusPopupStatus, setStatusPopupStatus] = useState<
  //   "success" | "error"
  // >("success");

  // const [loadingAddUser, setLoadingAddUser] = useState<boolean>(false);

  // const showStatusPopup = (message: string, status: "success" | "error") => {
  //   setStatusPopupMessage(message);
  //   setStatusPopupStatus(status);
  //   setIsStatusPopupOpen(true);
  // };

  // const handleAddUser = async (
  //   newUser: Omit<User, "user_id" | "products">
  // ) => {
  //   try {
  //     setLoadingAddUser(true);
  //     const response = await api.post("/users", newUser);
  //     setLoadingAddUser(false);

  //     await fetchUsers(); // Refresh data after addition
  //     if (response.status === 201) {
  //       console.log("User added:", response.data.data);
  //       showStatusPopup("User added successfully", "success");
  //     } else {
  //       console.error("Unexpected response:", response);
  //       showStatusPopup("Unexpected response while adding user", "error");
  //     }
  //   } catch (error: unknown) {
  //     setLoadingAddUser(false);
  //     if (error instanceof Error) {
  //       console.error("Error adding user:", error.message);
  //     } else {
  //       console.error("An unknown error occurred:", error);
  //     }
  //     showStatusPopup("An unexpected error occurred", "error");
  //   }
  // };

  return (
    <>
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between flex-wrap lg:flex-nowrap gap-4">
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
              // onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="relative w-full overflow-auto">
            <UserTable
              columns={columns}
              data={users}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async (user) => {
          await handleAddUser(user);
        }}
        loadingAddUser={loadingAddUser}
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
