import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { GoodsImageData } from "../interface/goodsimage/goods.image.data";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { GoodsImageService } from "../service/goods.image.service";
import { Resolver, Query, Mutation } from "@nestjs/graphql";
import { Data } from "../interface/data";
import { Request } from "express";


/* 商品图片的Resolver */
@Resolver("GoodsImage")
@UseInterceptors(ExceptionInterceptor)
export class GoodsImageResolver {

    constructor(
        @Inject(GoodsImageService) private readonly goodsImageService: GoodsImageService
    ) { }

    @Query("goodsImages")
    async goodsImages(req: Request, body: { goodsId: number }): Promise<GoodsImageData> {
        const { goodsId } = body;
        if (!goodsId) {
            throw new HttpException("指定id=" + goodsId + "商品不存在", 404);
        }
        const images: Array<{ id: number; bucketName: string; name: string, type: string; url: string }> = await this.goodsImageService.getGoodsImages(req, goodsId);
        return { code: 200, message: "获取指定商品的所有图片成功", images };
    }

    @Mutation("createGoodsImage")
    async createGoodsImage(req: Request, body: { goodsId: number, bucketName: string, rawName: string, base64: string }): Promise<Data> {
        const { goodsId, bucketName, rawName, base64 } = body;
        if (!goodsId || !bucketName || !rawName || !base64) {
            throw new HttpException("缺少参数", 404);
        }
        await this.goodsImageService.createGoodsImage(goodsId, bucketName, rawName, base64);
        return { code: 200, message: "创建商品图片成功" };
    }

    @Mutation("deleteGoodsImage")
    async deleteGoodsImage(req: Request, body: { goodsId: number, id: number }): Promise<Data> {
        const { goodsId, id } = body;
        if (!goodsId || !id) {
            throw new HttpException("缺少参数", 404);
        }
        await this.goodsImageService.deleteGoodsImage(goodsId, id);
        return { code: 200, message: "删除商品图片成功" };
    }

}
