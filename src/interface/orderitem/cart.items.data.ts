import { OrderItem } from "../../model/order.item.entity";

export interface CartItemsData {
    code: number;
    message: string;
    cartItems: Array<OrderItem>;
}