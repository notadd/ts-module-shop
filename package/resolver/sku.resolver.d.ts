/// <reference types="express" />
import { SkusData } from "../interface/sku/skus.data";
import { SkuService } from "../service/sku.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class SkuResolver {
    private readonly skuService;
    constructor(skuService: SkuService);
    skus(req: Request, body: {
        goodsId: number;
    }): Promise<SkusData>;
    createSku(req: Request, body: {
        goodsId: number;
        no: string;
        inventory: number;
        propertyValueIds: Array<number>;
    }): Promise<Data>;
    updateSku(req: Request, body: {
        id: number;
        no: string;
        inventory: number;
        propertyValueIds: Array<number>;
    }): Promise<Data>;
    deleteSku(req: Request, body: {
        id: number;
    }): Promise<Data>;
}
