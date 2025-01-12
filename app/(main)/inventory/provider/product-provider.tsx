"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "@/prisma/type";
import { api } from "@/lib/axios";

// Define the context type
interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string;
  setProducts: (products: Product[]) => void;
  fetchProducts: () => Promise<void>;
}

// Create the context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// ProductProvider Component
export const ProductProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <ProductContext.Provider
      value={{ products, loading, error, setProducts, fetchProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook for using the context
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};
