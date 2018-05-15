import { EvaluationImage } from "./evaluation.image.entity";
import { OrderItem } from "./order.item.entity";
import { User } from "@notadd/user";
export declare class Evaluation {
    id: number;
    content: string;
    display: boolean;
    userId: number;
    orderItemId: number;
    images: Array<EvaluationImage>;
    user: User;
    orderItem: OrderItem;
}
