"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ProductReturn } from "@/prisma/type";
import { api } from "@/lib/axios";

// Define the context type
interface ProductReturnContextType {
  productReturns: ProductReturn[];
  loading: boolean;
  error: string;
  setProductReturns: (productReturns: ProductReturn[]) => void;
  fetchProductReturns: () => Promise<void>;
}

// Create the context
const ProductReturnContext = createContext<ProductReturnContextType | undefined>(undefined);

// ProductReturnProvider Component
export const ProductReturnProvider = ({ children }: { children: ReactNode }) => {
  const [productReturns, setProductReturns] = useState<ProductReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProductReturns = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/productReturns");
      setProductReturns(data.data);
    } catch (err) {
      setError("Failed to load productReturns. Please try again.");
      console.error("Error fetching productReturns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductReturns();
  }, []);

  return (
    <ProductReturnContext.Provider
      value={{ productReturns, loading, error, setProductReturns, fetchProductReturns }}
    >
      {children}
    </ProductReturnContext.Provider>
  );
};

// Custom hook for using the context
export const useProductReturnContext = () => {
  const context = useContext(ProductReturnContext);
  if (!context) {
    throw new Error("useProductReturnContext must be used within a ProductReturnProvider");
  }
  return context;
};
