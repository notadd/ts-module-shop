/// <reference types="express" />
import { BrandsData } from "../interface/brand/brands.data";
import { BrandService } from "../service/brand.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class BrandResolver {
    private readonly brandService;
    constructor(brandService: BrandService);
    brands(req: Request): Promise<BrandsData>;
    createBrand(req: Request, body: {
        name: string;
    }): Promise<Data>;
    updateBrand(req: Request, body: {
        id: number;
        name: string;
    }): Promise<Data>;
    deleteBrand(req: Request, body: {
        id: number;
    }): Promise<Data>;
}
