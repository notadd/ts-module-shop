import { BrandLogo } from "./brand.logo.entity";
import { Goods } from "./goods.entity";
export declare class Brand {
    id: number;
    name: string;
    logo: BrandLogo;
    goodses: Array<Goods>;
}
