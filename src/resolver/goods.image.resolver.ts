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
        const {goodsId} = body;
        if (!goodsId) {
            throw new HttpException("指定id=" + goodsId + "商品不存在", 404);
        }
        const images: Array<{id: number; bucketName: string; name: string, type: string; url: string}> = await this.goodsImageService.getGoodsImages(goodsId);
        return {code: 200, message: "获取指定商品的所有图片成功", images};
    }

}
