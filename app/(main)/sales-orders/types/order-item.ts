import { Product } from "@/data/product";
export default interface OrderItem {
    product: Product;
    quantity: number;
}