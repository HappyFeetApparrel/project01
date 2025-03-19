import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

// types
import { ProductReturn } from "@/prisma/type";

// components
import Options from "./options";

import { ProductReturnCustom } from "./options";

export const columns: ColumnDef<ProductReturnCustom>[] = [
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
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("type")}</div>
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
          Quantity
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("quantity")}</div>
    ),
    minSize: 200,
    maxSize: 400,
    size: 250,
  },
  {
    accessorKey: "reason",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Reason
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div >{row.getValue("reason")}</div>
    ),
    minSize: 200,
    maxSize: 400,
    size: 250,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <Options row={row.original} />,
    size: 100,
  },
];
