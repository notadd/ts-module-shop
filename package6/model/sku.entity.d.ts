import { PropertyValue } from "./property.value.entity";
import { Goods } from "./goods.entity";
export declare class Sku {
    id: number;
    no: string;
    inventory: number;
    values: Array<PropertyValue>;
    goods: Goods;
}
