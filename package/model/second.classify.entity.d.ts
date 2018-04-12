import { FirstClassify } from "./first.classify.entity";
import { ThirdClassify } from "./third.classify.entity";
export declare class SecondClassify {
    id: number;
    name: string;
    description: string;
    level: number;
    parent: FirstClassify;
    children: Array<ThirdClassify>;
}
