import { PropertyValue } from "./property.value.entity";
import { ThirdClassify } from "./third.classify.entity";
import { GoodsImage } from "./goods.image.entity";
import { GoodsType } from "./goods.type.entity";
import { Floor } from "./floor.entity";
import { Brand } from "./brand.entity";
import { Sku } from "./sku.entity";
export declare class Goods {
    id: number;
    name: string;
    no: string;
    basePrice: number;
    discountPrice: number;
    description: string;
    recycle: boolean;
    classifyId: number;
    typeId: number;
    classify: ThirdClassify;
    brand: Brand;
    type: GoodsType;
    floors: Array<Floor>;
    values: Array<PropertyValue>;
    images: Array<GoodsImage>;
    skus: Array<Sku>;
}
