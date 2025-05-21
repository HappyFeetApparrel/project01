import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// types
import { FormattedOrder } from "./sales-dashboard";

export const columns: ColumnDef<FormattedOrder>[] = [
  {
    accessorKey: "productImage",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Image
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <img
        src={row.getValue("productImage")}
        alt="Sales"
        className="w-16 h-16 object-cover"
      />
    ),
    minSize: 200,
    maxSize: 400,
    size: 250,
  },
  {
    accessorKey: "productName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("productName")}</div>
    ),
    minSize: 200,
    maxSize: 400,
    size: 250,
  },
  {
    accessorKey: "orderCode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Code
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("orderCode")}</div>
    ),
    minSize: 200,
    maxSize: 400,
    size: 250,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity in Stock
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
    minSize: 100,
    maxSize: 200,
    size: 150,
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unit Price
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>₱{row.getValue("totalPrice")}</div>,
    minSize: 100,
    maxSize: 200,
    size: 150,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
    minSize: 100,
    maxSize: 200,
    size: 150,
  },
  {
    accessorKey: "brand",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Brand
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("brand")}</div>
    ),
    minSize: 100,
    maxSize: 200,
    size: 150,
  },
];
