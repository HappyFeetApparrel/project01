import OrderItem from "./order-item";

export default interface OrderData {
    items: OrderItem[],
    totalAmount: number,
    change: number,
    orderDate: Date,
}