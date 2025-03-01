"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import Image from "next/image";

// import axios
import { api } from "@/lib/axios";

import { Product } from "@/prisma/type";

interface ProductSearchProps {
  addToOrder: (product: Product) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string;
  setError: (error: string) => void;
}

export default function ProductSearch({
  addToOrder,
  products,
  setProducts,
  loading,
  setLoading,
  error,
  setError,
}: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/sales-orders");
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

  useEffect(() => {
    const filtered: Product[] = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  return (
    <div className="space-y-6">
      {/* Product Search */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products"
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product List */}
      <div className="border rounded-md max-h-[50vh] overflow-y-auto">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 hover:bg-muted transition-colors border-b last:border-b-0 animate-pulse"
            >
              <Skeleton className="w-12 h-12 rounded-md" />
              <div className="flex-1">
                <Skeleton className="w-1/2 h-4 mb-2" />
                <Skeleton className="w-1/3 h-4" />
              </div>
              <div className="text-right">
                <Skeleton className="w-1/2 h-4 mb-2" />
                <Skeleton className="w-1/3 h-4" />
              </div>
              <Button size="sm" disabled>
                <Skeleton className="w-4 h-4" />
              </Button>
            </div>
          ))
        ) : error ? (
          <div className="border rounded-md max-h-[50vh] overflow-y-auto">
            <div className="flex items-center gap-4 p-4 hover:bg-muted transition-colors border-b last:border-b-0"></div>
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product: Product) => (
            <div
              key={product.product_id}
              className="flex items-center gap-4 p-4 hover:bg-muted transition-colors border-b last:border-b-0"
            >
              <Image
                src={product.product_image ?? ""}
                alt={product.name}
                width={48}
                height={48}
                className="rounded-md object-cover w-14 h-14"
              />
              <div className="flex-1">
                <h4 className="font-medium">{product.name}</h4>
              </div>
              <div className="text-right">
                <p className="font-medium">₱{product.unit_price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  Stock: {product.quantity_in_stock}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => addToOrder(product)}
                disabled={product.quantity_in_stock === 0}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <div className="px-4 py-2 text-gray-500">No products found</div>
        )}
      </div>
    </div>
  );
}
