import { Order } from "./order.entity";
import { Sku } from "./sku.entity";
export declare class OrderItem {
    id: number;
    count: number;
    skuId: number;
    userId: number;
    order: Order;
    sku: Sku;
}
