import { GoodsProperty } from "./goods.property.entity";
import { Goods } from "./goods.entity";
export declare class GoodsType {
    id: number;
    name: string;
    properties: Array<GoodsProperty>;
    goodses: Array<Goods>;
}
