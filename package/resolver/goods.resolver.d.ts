/// <reference types="express" />
import { GoodsesData } from "../interface/goods/goodses.data";
import { GoodsData } from "../interface/goods/goods.data";
import { GoodsService } from "../service/goods.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class GoodsResolver {
    private readonly goodsService;
    constructor(goodsService: GoodsService);
    goodses(req: Request, body: {
        classifyId: number;
        pageNumber: number;
        pageSize: number;
    }): Promise<GoodsesData>;
    goods(req: Request, body: {
        id: number;
    }): Promise<GoodsData>;
    createGoods(req: Request, body: {
        name: string;
        basePrice: number;
        description: string;
        classifyId: number;
        goodsTypeId: number;
        brandId: number;
    }): Promise<Data>;
    updateGoods(req: Request, body: {
        id: number;
        name: string;
        basePrice: number;
        description: string;
        classifyId: number;
        goodsTypeId: number;
        brandId: number;
    }): Promise<Data>;
    deleteGoods(req: Request, body: {
        id: number;
    }): Promise<Data>;
}
