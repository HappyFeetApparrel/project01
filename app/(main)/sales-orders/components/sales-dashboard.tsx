"use client";
import { useState, useEffect } from "react";

import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";

import { Skeleton } from "@/components/ui/skeleton";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  const [salesData, setSalesData] = useState([]);
  const [ordersData, setOrdersData] = useState<FormattedOrder[]>([]);
  const [loadingSales, setLoadingSales] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorSales, setErrorSales] = useState("");
  const [errorOrders, setErrorOrders] = useState("");
  const [period, setPeriod] = useState("7days");
  const [newOrder, setNewOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailPopup, setShowFailPopup] = useState(false);
  const [showPrintInvoice, setShowPrintInvoice] = useState(false);

  const [currentOrderData, setCurrentOrderData] = useState<OrderData | null>(
    null
  );

  const { order, setCreateOrder } = useLayout();

  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        const { data } = await api.get("/sales-report");
        setSalesData(data.data);
      } catch {
        setErrorSales("Failed to fetch sales report");
      } finally {
        setLoadingSales(false);
      }
    };
    fetchSalesReport();
  }, []);

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
                Place Order
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
        </div>

        {/* Sales Report Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Sales Report</h2>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#00A3FF]" />
                <span className="text-sm text-muted-foreground">
                  Direct Sales
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#9747FF]" />
                <span className="text-sm text-muted-foreground">Retail</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#E93BF9]" />
                <span className="text-sm text-muted-foreground">Wholesale</span>
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full">
            {loadingSales ? (
              <ResponsiveContainer width="100%" height="100%">
                <div className="h-full w-full flex justify-center items-center">
                  <Skeleton className="w-full h-[350px]" />
                </div>
              </ResponsiveContainer>
            ) : errorSales ? (
              <p className="text-red-500">{errorSales}</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    domain={[0, 25000]}
                    ticks={[0, 5000, 10000, 15000, 20000, 25000]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="directSales"
                    stroke="#00A3FF"
                    strokeWidth={2}
                    dot={{ fill: "#00A3FF", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="retail"
                    stroke="#9747FF"
                    strokeWidth={2}
                    dot={{ fill: "#9747FF", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="wholesale"
                    stroke="#E93BF9"
                    strokeWidth={2}
                    dot={{ fill: "#E93BF9", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
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
      {showPrintInvoice && (
        <PrintInvoiceDialog
          isOpen={showPrintInvoice}
          onClose={handlePrintInvoiceClose}
          orderData={currentOrderData}
        />
      )}
      {showSuccessPopup && (
        <SuccessPopup
          message="Order placed successfully!"
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
      {showFailPopup && (
        <FailPopup
          message="Failed to place order. Please try again."
          onClose={() => setShowFailPopup(false)}
        />
      )}
    </>
  );
}
