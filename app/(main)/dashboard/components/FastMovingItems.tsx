import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Macbook Pro",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "iPhone 14 Pro",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Zoom75",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Airpods Pro",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Samsung Galaxy Fold",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Samsung Odyssey",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "Logitech Superlight",
    image: "/placeholder.svg?height=40&width=40",
  },
];

export default function FastMovingItems() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Fast Moving Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 rounded-lg transition-colors hover:bg-muted/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background p-1">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-medium">{product.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
