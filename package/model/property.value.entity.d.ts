import { GoodsProperty } from "./goods.property.entity";
import { Goods } from "./goods.entity";
export declare class PropertyValue {
    id: number;
    value: string;
    price: number;
    property: GoodsProperty;
    goods: Goods;
}
