"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Brand } from "@/prisma/type";
import { api } from "@/lib/axios";

// Define the context type
interface BrandContextType {
  brands: Brand[];
  loading: boolean;
  error: string;
  setBrands: (brands: Brand[]) => void;
  fetchBrands: () => Promise<void>;
}

// Create the context
const BrandContext = createContext<BrandContextType | undefined>(undefined);

// BrandProvider Component
export const BrandProvider = ({ children }: { children: ReactNode }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/brands");
      setBrands(data.data);
    } catch (err) {
      setError("Failed to load brands. Please try again.");
      console.error("Error fetching brands:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <BrandContext.Provider
      value={{ brands, loading, error, setBrands, fetchBrands }}
    >
      {children}
    </BrandContext.Provider>
  );
};

// Custom hook for using the context
export const useBrandContext = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrandContext must be used within a BrandProvider");
  }
  return context;
};
