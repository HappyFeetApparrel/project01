import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";

// types
import { Product } from "@/prisma/type";

// components
import Options from "./options";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "product_image",
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
      <Image
        src={row.getValue("product_image")}
        alt="Product"
        width={400}
        height={300}
        className="w-16 h-16 object-cover"
      />
    ),
    minSize: 200,
    maxSize: 400,
    size: 250,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    minSize: 200,
    maxSize: 400,
    size: 250,
  },
  {
    accessorKey: "quantity_in_stock",
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
    cell: ({ row }) => <div>{row.getValue("quantity_in_stock")}</div>,
    minSize: 100,
    maxSize: 200,
    size: 150,
  },
  {
    accessorKey: "unit_price",
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
    cell: ({ row }) => {
      const value = row.getValue("unit_price");
      const formattedValue =
        typeof value === "number" && !isNaN(value) ? value : 0;

      return (
        <div className="text-right">
          ₱
          {new Intl.NumberFormat("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(formattedValue)}
        </div>
      );
    },
    minSize: 100,
    maxSize: 200,
    size: 150,
  },
  {
    accessorKey: "size",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Size
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("size")}</div>
    ),
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
      <div className="capitalize">{row.original.brand?.name}</div>
    ),
    minSize: 100,
    maxSize: 200,
    size: 150,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <Options row={row.original} />,
    size: 100,
  },
];
