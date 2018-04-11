import { SecondClassify } from "./second.classify.entity";
export declare class FirstClassify {
    id: number;
    name: string;
    description: string;
    level: number;
    children: Array<SecondClassify>;
}
