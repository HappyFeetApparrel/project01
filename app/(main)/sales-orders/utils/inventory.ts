import { Product } from "@/data/product";

// This would typically be a database call
let inventory: Product[] = [
    {
        productId: "PROD001",
        name: "Macbook Pro",
        description: "Latest model Macbook Pro",
        category: "Laptop",
        sku: "MAC001",
        barcode: "123456789",
        quantity: 50,
        reorderLevel: 10,
        unitPrice: 1299.99,
        costPrice: 999.99,
        supplier: "Apple Inc",
        dateOfEntry: new Date(),
        size: "15-inch",
        color: "Space Gray",
        material: "Aluminum",
        style: "Professional",
        brand: "Apple",
        season: "All Season",
        status: "In Stock",
        location: "Warehouse A",
        discount: 0,
        image: "/placeholder.svg"
    },
    {
        productId: "PROD002",
        name: "iPhone 13",
        description: "Latest iPhone model",
        category: "Smartphone",
        sku: "IPH002",
        barcode: "987654321",
        quantity: 100,
        reorderLevel: 20,
        unitPrice: 999.99,
        costPrice: 699.99,
        supplier: "Apple Inc",
        dateOfEntry: new Date(),
        size: "6.1-inch",
        color: "Midnight",
        material: "Glass and Aluminum",
        style: "Modern",
        brand: "Apple",
        season: "All Season",
        status: "In Stock",
        location: "Warehouse B",
        discount: 5,
        image: "/placeholder.svg"
    },
]

export function getInventory(): Product[] {
    return inventory
}

export function updateInventory(orderedItems: { productId: string; quantity: number }[]): void {
    inventory = inventory.map(product => {
        const orderedItem = orderedItems.find(item => item.productId === product.productId)
        if (orderedItem) {
            return {
                ...product,
                quantity: product.quantity - orderedItem.quantity
            }
        }
        return product
    })
}

