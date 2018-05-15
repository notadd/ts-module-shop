/// <reference types="express" />
import { GoodsImageData } from "../interface/goodsimage/goods.image.data";
import { GoodsImageService } from "../service/goods.image.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class GoodsImageResolver {
    private readonly goodsImageService;
    constructor(goodsImageService: GoodsImageService);
    goodsImages(req: Request, body: {
        goodsId: number;
    }): Promise<GoodsImageData>;
    createGoodsImage(req: Request, body: {
        goodsId: number;
        bucketName: string;
        rawName: string;
        base64: string;
    }): Promise<Data>;
    deleteGoodsImage(req: Request, body: {
        goodsId: number;
        id: number;
    }): Promise<Data>;
}
