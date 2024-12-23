export interface Product {
    name: string
    code: string
    type: string
    price: number
    quantity: number
    image: string
}

export const products: Product[] = [
    {
        name: "Macbook Pro",
        code: "#0001",
        type: "Laptop",
        price: 1241,
        quantity: 44,
        image: "/placeholder.svg?height=40&width=40"
    },
    {
        name: "iPhone 14 pro",
        code: "#0002",
        type: "Phone",
        price: 1499,
        quantity: 23,
        image: "/placeholder.svg?height=40&width=40"
    },
    {
        name: "Zoom75",
        code: "#0003",
        type: "Keyboard",
        price: 215,
        quantity: 23,
        image: "/placeholder.svg?height=40&width=40"
    },
    {
        name: "Airpods Pro",
        code: "#0004",
        type: "Earphones",
        price: 249,
        quantity: 23,
        image: "/placeholder.svg?height=40&width=40"
    },
    {
        name: "Samsung Galaxy Fold",
        code: "#0005",
        type: "Phone",
        price: 1199,
        quantity: 23,
        image: "/placeholder.svg?height=40&width=40"
    },
    {
        name: "Samsung Odyssey",
        code: "#0006",
        type: "Displays",
        price: 500,
        quantity: 23,
        image: "/placeholder.svg?height=40&width=40"
    },
    {
        name: "Logitech Superlight",
        code: "#0007",
        type: "Displays",
        price: 500,
        quantity: 23,
        image: "/placeholder.svg?height=40&width=40"
    }
]

