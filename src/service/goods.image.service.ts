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

    async createGoodsImage(goodsId: number, bucketName: string, rawName: string, base64: string): Promise<void> {
        const goods: Goods | undefined = await this.goodsRepository.findOneById(goodsId);
        if (!goods) {
            throw new HttpException("指定id=" + goodsId + "商品不存在", 404);
        }
        const { name, type } = await this.storeComponent.upload(bucketName, rawName, base64, undefined);
        try {
            await this.goodsImageRepository.save({ bucketName, name, type, goods });
        } catch (err) {
            await this.storeComponent.delete(bucketName, name, type);
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async deleteGoodsImage(goodsId: number, id: number): Promise<void> {
        const goods: Goods | undefined = await this.goodsRepository.findOneById(goodsId, { relations: ["images"] });
        if (!goods) {
            throw new HttpException("指定id=" + goodsId + "商品不存在", 404);
        }
        const image: GoodsImage | undefined = goods.images.find(img => img.id === id);
        if (!image) {
            throw new HttpException("指定id=" + id + "图片不存在于指定id=" + goodsId + "商品之下", 404);
        }
        try {
            await this.storeComponent.delete(image.bucketName, image.name, image.type);
            await this.goodsImageRepository.remove(image);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }
}
