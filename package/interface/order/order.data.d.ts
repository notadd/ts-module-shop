import { Order } from "../../model/order.entity";
export interface OrderData {
    code: number;
    message: string;
    order: Order;
}
