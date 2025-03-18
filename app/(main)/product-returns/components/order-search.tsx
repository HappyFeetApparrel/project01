"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// import axios
import { api } from "@/lib/axios";

import { SalesOrder } from "@/prisma/type";

import { LineWave } from "react-loader-spinner";

interface SalesOrderSearchProps {
  value: number | undefined;
  onChange: (value: number) => void;
  disabled?: boolean;
}

interface SalesOrderWithCode extends SalesOrder {
    orderCode: string;
    id: number;
    productName: string;
    productImage: string;
  }

export default function SalesOrderSearch({
  value,
  onChange,
  disabled,
}: SalesOrderSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSalesOrders, setFilteredSalesOrders] = useState<SalesOrderWithCode[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [salesOrders, setSalesOrders] = useState<SalesOrderWithCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSalesOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/order-data");
      setSalesOrders(data.data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesOrders();
  }, []);

  useEffect(() => {
    const filtered: SalesOrderWithCode[] = salesOrders.filter((salesOrder) =>
      salesOrderInfo(salesOrder).toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSalesOrders(filtered);
  }, [searchTerm, salesOrders]);

  useEffect(() => {
    const selectedSalesOrder = salesOrders.find((salesOrder) => salesOrder.id === value);
    if (selectedSalesOrder) {
      setSearchTerm(salesOrderInfo(selectedSalesOrder));
    } else {
      setSearchTerm("");
    }
  }, [value, salesOrders]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onChange(0); // Reset the form value when user types
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleSalesOrderClick = (id: number, salesOrderName: string) => {
    onChange(id);
    setSearchTerm(salesOrderName);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const salesOrderInfo = (salesOrder: SalesOrderWithCode) => {
    return `${salesOrder.orderCode} - ${salesOrder.productName}`;
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          ref={inputRef}
          placeholder="Search sales orders..."
          aria-label="Search sales orders"
          aria-expanded={isOpen}
          aria-controls="salesOrder-list"
          disabled={disabled ? true : false}
        />
        {!disabled && (
          <Search
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        )}
      </div>
      {isOpen && (
        <div
          id="salesOrder-list"
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {loading ? (
            <>
              <LineWave
                visible={true}
                height="100"
                width="100"
                color="#00a3ff"
                ariaLabel="line-wave-loading"
                wrapperStyle={{}}
                wrapperClass="justify-center h-[300px] items-center"
                firstLineColor=""
                middleLineColor=""
                lastLineColor=""
              />
            </>
          ) : error ? (
            <p>Error loading data: {error}</p>
          ) : filteredSalesOrders.length > 0 ? (
            filteredSalesOrders.map((salesOrder: SalesOrderWithCode, index: number) => (
              <Button
                key={index}
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-100 focus:bg-blue-100 focus:outline-none bg-white "
                onClick={() => handleSalesOrderClick(salesOrder.id, salesOrderInfo(salesOrder))}
                type="button"
              >
                {`${salesOrderInfo(salesOrder)}`}
              </Button>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No sales orders found</div>
          )}
        </div>
      )}
    </div>
  );
}
