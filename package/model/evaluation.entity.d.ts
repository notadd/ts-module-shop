import { OrderItem } from "./order.item.entity";
import { User } from "@notadd/user";
export declare class Evaluation {
    id: number;
    content: string;
    display: boolean;
    userId: number;
    user: User;
    orderItemId: number;
    orderItem: OrderItem;
}
