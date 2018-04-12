import { Component, HttpException, Inject } from "@nestjs/common";
import { StoreComponent } from "../interface/store.component";
import { GoodsImage } from "../model/goods.image.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Goods } from "../model/goods.entity";
import { Repository } from "typeorm";
import { Request } from "express";

/* 商品图片的服务组件 */
@Component()
export class GoodsImageService {

    constructor(
        @Inject("StoreComponentToken") private readonly storeComponent: StoreComponent,
        @InjectRepository(Goods) private readonly goodsRepository: Repository<Goods>,
        @InjectRepository(GoodsImage) private readonly goodsImageRepository: Repository<GoodsImage>
    ) { }

    async getGoodsImages(req: Request, goodsId: number): Promise<Array<{ id: number, bucketName: string, name: string, type: string, url: string }>> {
        const goods: Goods | undefined = await this.goodsRepository.findOneById(goodsId, { relations: ["images"] });
        if (!goods) {
            throw new HttpException("指定id=" + goodsId + "商品不存在", 404);
        }
        const images: Array<{ id: number, bucketName: string, name: string, type: string, url: string }> = goods.images as any;
        for (let i = 0; i < images.length; i++) {
            images[i].url = await this.storeComponent.getUrl(req, images[i].bucketName, images[i].name, images[i].type, undefined);
        }
        return images;
    }




}