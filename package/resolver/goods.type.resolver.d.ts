/// <reference types="express" />
import { GoodsTypesData } from "../interface/goodstype/goods.types.data";
import { GoodsTypeData } from "../interface/goodstype/goods.type.data";
import { GoodsTypeService } from "../service/goods.type.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class GoodsTypeResolver {
    private readonly goodsTypeService;
    constructor(goodsTypeService: GoodsTypeService);
    goodsTypes(req: Request): Promise<GoodsTypesData>;
    goodsType(req: Request, body: {
        id: number;
    }): Promise<GoodsTypeData>;
    createGoodsType(req: Request, body: {
        name: string;
    }): Promise<Data>;
    updateGoodsType(req: Request, body: {
        id: number;
        name: string;
    }): Promise<Data>;
    deleteGoodsType(req: Request, body: {
        id: number;
    }): Promise<Data>;
}
