/// <reference types="express" />
import { RecycleGoodsesData } from "../interface/goods/recycle.goodses.data";
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
    recycleGoodses(req: Request, body: {
        pageNumber: number;
        pageSize: number;
    }): Promise<RecycleGoodsesData>;
    goods(req: Request, body: {
        id: number;
    }): Promise<GoodsData>;
    createGoods(req: Request, body: {
        name: string;
        no: string;
        basePrice: number;
        discountPrice: number;
        description: string;
        classifyId: number;
        goodsTypeId: number;
        brandId: number;
    }): Promise<Data>;
    updateGoods(req: Request, body: {
        id: number;
        name: string;
        no: string;
        basePrice: number;
        discountPrice: number;
        description: string;
        classifyId: number;
        goodsTypeId: number;
        brandId: number;
    }): Promise<Data>;
    deleteGoods(req: Request, body: {
        id: number;
    }): Promise<Data>;
    softDeleteGoods(req: Request, body: {
        id: number;
    }): Promise<Data>;
    softDeleteGoodses(req: Request, body: {
        ids: Array<number>;
    }): Promise<Data>;
    restoreGoods(req: Request, body: {
        id: number;
    }): Promise<Data>;
    restoreGoodses(req: Request, body: {
        ids: Array<number>;
    }): Promise<Data>;
}
