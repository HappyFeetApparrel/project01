"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Supplier } from "@/prisma/type";
import { api } from "@/lib/axios";

// Define the context type
interface SupplierContextType {
  suppliers: Supplier[];
  loading: boolean;
  error: string;
  setSuppliers: (suppliers: Supplier[]) => void;
  fetchSuppliers: () => Promise<void>;
}

// Create the context
const SupplierContext = createContext<SupplierContextType | undefined>(
  undefined
);

// SupplierProvider Component
export const SupplierProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <SupplierContext.Provider
      value={{ suppliers, loading, error, setSuppliers, fetchSuppliers }}
    >
      {children}
    </SupplierContext.Provider>
  );
};

// Custom hook for using the context
export const useSupplierContext = () => {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error(
      "useSupplierContext must be used within a SupplierProvider"
    );
  }
  return context;
};
