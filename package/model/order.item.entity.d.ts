import { Evaluation } from "./evaluation.entity";
import { Order } from "./order.entity";
import { Sku } from "./sku.entity";
export declare class OrderItem {
    id: number;
    count: number;
    skuId: number;
    userId: number;
    evaluation: Evaluation;
    order: Order;
    sku: Sku;
}
