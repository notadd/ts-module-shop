import { PropertyValue } from "./property.value.entity";
import { GoodsType } from "./goods.type.entity";
export declare class GoodsProperty {
    id: number;
    name: string;
    type: string;
    inputType: string;
    list: Array<string>;
    goodsTypeId: number;
    goodsType: GoodsType;
    values: Array<PropertyValue>;
}
