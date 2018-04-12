import { SecondClassify } from "./second.classify.entity";
import { Goods } from "./goods.entity";
export declare class ThirdClassify {
    id: number;
    name: string;
    description: string;
    level: number;
    parent: SecondClassify;
    goodses: Array<Goods>;
}
