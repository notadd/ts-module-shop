/// <reference types="express" />
import { StoreComponent } from "../interface/store.component";
import { GoodsImage } from "../model/goods.image.entity";
import { Goods } from "../model/goods.entity";
import { Repository } from "typeorm";
import { Request } from "express";
export declare class GoodsImageService {
    private readonly storeComponent;
    private readonly goodsRepository;
    private readonly goodsImageRepository;
    constructor(storeComponent: StoreComponent, goodsRepository: Repository<Goods>, goodsImageRepository: Repository<GoodsImage>);
    getGoodsImages(req: Request, goodsId: number): Promise<Array<{
        id: number;
        bucketName: string;
        name: string;
        type: string;
        url: string;
    }>>;
    createGoodsImage(goodsId: number, bucketName: string, rawName: string, base64: string): Promise<void>;
    deleteGoodsImage(goodsId: number, id: number): Promise<void>;
}
