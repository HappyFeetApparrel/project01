"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/prisma/type";
import { api } from "@/lib/axios";

// Define the context type
interface UserContextType {
  users: User[];
  loading: boolean;
  error: string;
  setUsers: (users: User[]) => void;
  fetchUsers: () => Promise<void>;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// UserProvider Component
export const UserProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <UserContext.Provider
      value={{ users, loading, error, setUsers, fetchUsers }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the context
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
