import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

import Image from "next/image";

// types
import { Product } from "@/prisma/type";

// components
// import Options from "./options";

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
  {
    accessorKey: "image",
    header: () => {
      return <Button variant="ghost">Image</Button>;
    },
    cell: ({ row }) => (
      <Image
        src={`https://picsum.photos/seed/${Math.random()
          .toString(36)
          .substring(2, 8)}/2428/2447`}
        alt={row.getValue("name")}
        width={40}
        height={40}
        className="object-contain"
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
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
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
          Quantity in stock
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase text-center">
        {row.getValue("quantity_in_stock")}
      </div>
    ),
    minSize: 200,
    maxSize: 400,
    size: 250,
  },
  {
    accessorKey: "cost_price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        ₱{row.getValue("cost_price")?.toLocaleString()}
      </div>
    ),
    minSize: 200,
    maxSize: 400,
    size: 250,
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
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("status")}</div>
    ),
    minSize: 200,
    maxSize: 400,
    size: 250,
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => <Options row={row.original} />,
  //   size: 100,
  // },
];
