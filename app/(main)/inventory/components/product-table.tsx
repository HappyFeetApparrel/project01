"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Product } from "../data/product";

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginatedProducts = products.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-12">
              <Checkbox />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Image</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.map((product) => (
            <TableRow key={product.code}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.code}</TableCell>
              <TableCell>{product.type}</TableCell>
              <TableCell>${product.price.toLocaleString()}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Button
            key={pageNum}
            variant={pageNum === page ? "default" : "outline"}
            size="sm"
            onClick={() => setPage(pageNum)}
          >
            {pageNum}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
