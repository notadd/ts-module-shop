import { PropertyValue } from "./property.value.entity";
import { OrderItem } from "./order.item.entity";
import { Goods } from "./goods.entity";
export declare class Sku {
    id: number;
    no: string;
    inventory: number;
    orderItems: Array<OrderItem>;
    values: Array<PropertyValue>;
    goods: Goods;
}
