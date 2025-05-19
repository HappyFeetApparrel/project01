"use client";
import { useState, useEffect } from "react";

import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";

import SalesReport from "./sales-report";
import { useSearchParams } from "next/navigation";

// import component
import { PlaceOrderDialog } from "./place-order-dialog";
import SalesTable from "./sales-table";

import { api } from "@/lib/axios";

import { columns } from "./columns";

export interface FormattedOrder {
  productImage: string;
  id: string;
  productName: string;
  orderCode: string;
  category: string;
  quantity: number;
  totalPrice: number;
}

import { SuccessPopup } from "./success-popup";
import { FailPopup } from "./fail-popup";
import { PrintInvoiceDialog } from "./print-invoice-dialog";

import { useLayout } from "@/components/context/LayoutProvider";

import { OrderData } from "./place-order-dialog";

export default function SalesDashboard() {
  const [open, setOpen] = useState(false);
  const [ordersData, setOrdersData] = useState<FormattedOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState("");
  const [period, setPeriod] = useState("7days");
  const [newOrder, setNewOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailPopup, setShowFailPopup] = useState(false);
  const [showPrintInvoice, setShowPrintInvoice] = useState(false);
  const search = useSearchParams();

  const [currentOrderData, setCurrentOrderData] = useState<OrderData | null>(
    null
  );

  const [price, setPrice] = useState<number>(0);
  const [isProductSwap, setIsProductSwap] = useState<boolean>(false);

  useEffect(() => {
    if (search.size === 0) return;

    setOpen(true);
    setPrice(Number(search.get("price") ?? 0));
    setIsProductSwap(search.get("isProductSwap") === "swap");
  }, [search.size]);

  const { order, setCreateOrder } = useLayout();

  useEffect(() => {
    if (order) {
      setOpen(true);
      setCreateOrder(false);
    }
  }, [order]);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoadingOrders(true);
        const { data } = await api.get(`/order-data?period=${period}`);
        setOrdersData(data.data);
        setLoadingOrders(false);
      } catch {
        setLoadingOrders(false);

        setErrorOrders("Failed to fetch order data");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrderData();
  }, [period, newOrder]);

  const handlePrintInvoiceClose = () => {
    setShowPrintInvoice(false);
    setShowSuccessPopup(true);
    setShowSuccessPopup(false);
    setOpen(false);
  };

  const filteredOrders = ordersData.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order.productName.toLowerCase().includes(query) ||
      order.orderCode.toLowerCase().includes(query) ||
      order.category.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <div className="w-full space-y-8">
        {/* Sales Orders Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-semibold">Sales Orders</h2>
            <div className="flex gap-4 flex-wrap flex-col w-full sm:flex-row">
              <div className="flex items-center gap-4 flex-1 max-w-xl flex-nowrap flex-grow">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search"
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Button
                className="bg-[#00A3FF] hover:bg-[#00A3FF]/90"
                onClick={() => setOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Process Order
              </Button>
            </div>
          </div>

          <SalesTable
            data={filteredOrders}
            loading={loadingOrders}
            error={errorOrders}
            columns={columns}
            setPeriod={setPeriod}
          />

          <SalesReport />
        </div>
      </div>
      <PlaceOrderDialog
        open={open}
        setOpen={setOpen}
        setNewOrder={setNewOrder}
        setCurrentOrderData={setCurrentOrderData}
        setShowFailPopup={setShowFailPopup}
        setShowPrintInvoice={setShowPrintInvoice}
      />
      {showPrintInvoice && newOrder && (
        // <PrintInvoiceDialog
        //   isOpen={showPrintInvoice}
        //   onClose={handlePrintInvoiceClose}
        //   orderData={currentOrderData}
        // />
        <PrintInvoiceDialog
          isOpen={showPrintInvoice}
          onClose={handlePrintInvoiceClose}
          orderData={currentOrderData}
          orderCode={newOrder}
        />
      )}
      {showSuccessPopup && (
        <SuccessPopup
          message="Order processed successfully!"
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
      {showFailPopup && (
        <FailPopup
          message="Failed to process order. Please try again."
          onClose={() => setShowFailPopup(false)}
        />
      )}
    </>
  );
}
