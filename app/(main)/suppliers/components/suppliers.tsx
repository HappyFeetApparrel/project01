"use client";

import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const suppliers = [
  {
    id: 1,
    name: "Apple",
    logo: "/placeholder.svg?height=40&width=40",
    email: "apple@gmail.com",
    contact: "+63 123 4243",
  },
  {
    id: 2,
    name: "Samsung",
    logo: "/placeholder.svg?height=40&width=40",
    email: "samsung@gmail.com",
    contact: "+63 133 3453",
  },
  {
    id: 3,
    name: "Mugna Tech",
    logo: "/placeholder.svg?height=40&width=40",
    email: "logitech@gmail.com",
    contact: "+63 433 4451",
  },
  {
    id: 4,
    name: "Logitech",
    logo: "/placeholder.svg?height=40&width=40",
    email: "xiao.mi@gmail.com",
    contact: "+63 433 4531",
  },
  {
    id: 5,
    name: "Asus",
    logo: "/placeholder.svg?height=40&width=40",
    email: "asus@gmail.com",
    contact: "+63 234 6457",
  },
  {
    id: 6,
    name: "Lian Li",
    logo: "/placeholder.svg?height=40&width=40",
    email: "microsoft@gmail.com",
    contact: "+63 546 8345",
  },
  {
    id: 7,
    name: "NZXT",
    logo: "/placeholder.svg?height=40&width=40",
    email: "hello@mugna.tech",
    contact: "+63 917 1033 599",
  },
  {
    id: 8,
    name: "Xiaomi",
    logo: "/placeholder.svg?height=40&width=40",
    email: "lianli@gmail.com",
    contact: "+63 123 3345",
  },
  {
    id: 9,
    name: "Microsoft",
    logo: "/placeholder.svg?height=40&width=40",
    email: "akko@gmail.com",
    contact: "+63 334 5673",
  },
  {
    id: 10,
    name: "Sony",
    logo: "/placeholder.svg?height=40&width=40",
    email: "intel@gmail.com",
    contact: "+63 986 7465",
  },
  {
    id: 11,
    name: "Dell",
    logo: "/placeholder.svg?height=40&width=40",
    email: "nvidia@gmail.com",
    contact: "+63 461 4677",
  },
];

export default function Suppliers() {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-semibold">Suppliers</h2>
        <div className="flex gap-4 flex-wrap flex-col w-full sm:flex-row">
          <div className="flex items-center gap-4 flex-1 max-w-xl flex-nowrap flex-grow">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search" className="pl-8" />
            </div>
          </div>
          <Button className="bg-[#00A3FF] hover:bg-[#00A3FF]/90">
            <Plus className="mr-2 h-4 w-4" />
            Add New Supplier
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b transition-colors">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Supplier Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Email
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Contact No.
                </th>
                <th className="h-12 px-4 text-right align-middle"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={supplier.logo}
                        alt={supplier.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <span className="font-medium">{supplier.name}</span>
                    </div>
                  </td>
                  <td className="p-4">{supplier.email}</td>
                  <td className="p-4">{supplier.contact}</td>
                  <td className="p-4 text-right">
                    <Button variant="link" className="text-[#00A3FF]">
                      Order History
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#00A3FF] text-white hover:bg-[#00A3FF]/90"
          >
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            4
          </Button>
          <Button variant="outline" size="sm">
            5
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
