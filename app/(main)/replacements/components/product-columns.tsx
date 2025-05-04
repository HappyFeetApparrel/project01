import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

// types
import { Replace } from "@/prisma/type";

export const columns: ColumnDef<Replace>[] = [
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
      <div className="capitalize">{row.getValue("type") ?? "N/A"}</div>
    ),
    minSize: 200,
    maxSize: 400,
    size: 250,
  },
  {
    accessorKey: "original_order",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Original Order
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("original_order") ?? "N/A"}
      </div>
    ),
    minSize: 200,
    maxSize: 400,
    size: 250,
  },
  {
    accessorKey: "replacement_order",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Replacement Order
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("replacement_order") ?? "N/A"}
      </div>
    ),
    minSize: 200,
    maxSize: 400,
    size: 250,
  },
  {
    accessorKey: "replacement_product_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Replacement Product
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("replacement_product_name") ?? "N/A"}
      </div>
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
    cell: ({ row }) => <div>{row.getValue("reason")}</div>,
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
