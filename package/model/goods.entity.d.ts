import { PropertyValue } from "./property.value.entity";
import { ThirdClassify } from "./third.classify.entity";
import { GoodsType } from "./goods.type.entity";
import { Brand } from "./brand.entity";
export declare class Goods {
    id: number;
    name: string;
    basePrice: number;
    description: string;
    classifyId: number;
    classify: ThirdClassify;
    brand: Brand;
    type: GoodsType;
    values: Array<PropertyValue>;
}
