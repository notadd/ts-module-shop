import { Order } from "../../model/order.entity";

export interface OrdersData {
    code: number;
    message: string;
    orders: Array<Order>;
}