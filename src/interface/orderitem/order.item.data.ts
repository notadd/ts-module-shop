import { OrderItem } from "../../model/order.item.entity";

export interface OrderItemData {
    code: number;
    message: string;
    orderItem: OrderItem;
}