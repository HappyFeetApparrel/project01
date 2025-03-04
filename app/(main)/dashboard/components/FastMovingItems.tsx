import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { api } from "@/lib/axios"; // Import the api from your axios configuration
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: number;
  name: string;
  image: string;
}

export default function FastMovingItems() {
  const [fastMovingItems, setFastMovingItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fetch data on mount
  useEffect(() => {
    const fetchFastMovingItems = async () => {
      try {
        const { data } = await api.get("/latest-purchased-items"); // Replace with actual API endpoint
        if (data?.data?.length > 0) {
          setFastMovingItems(data.data);
        } else {
          setFastMovingItems([]);
          setErrorMessage("No fast-moving items available.");
        }
      } catch (error) {
        console.error("Error fetching fast-moving items:", error);
        setErrorMessage("Error fetching the data.");
      } finally {
        setIsLoading(false); // Set loading state to false after fetching is done
      }
    };

    fetchFastMovingItems();
  }, []);

  if (errorMessage) {
    return <div>{errorMessage}</div>; // Show error message if any
  }

  return (
    <Card className="w-full xl:max-w-sm max-w-full">
      <CardHeader>
        <CardTitle>Latest Purchased Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isLoading && fastMovingItems.length > 0
            ? fastMovingItems.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 rounded-lg transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background p-1">
                    <Image
                      src={`https://picsum.photos/seed/${Math.random()
                        .toString(36)
                        .substring(2, 8)}/2428/2447`}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium">{product.name}</span>
                </div>
              ))
            : Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
                    <Skeleton className="w-10 h-10 " />
                  </div>
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  );
}
