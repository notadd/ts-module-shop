import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { GoodsesData } from "../interface/goods/goodses.data";
import { Resolver, Mutation, Query } from "@nestjs/graphql";
import { GoodsData } from "../interface/goods/goods.data";
import { GoodsService } from "../service/goods.service";
import { Goods } from "../model/goods.entity";
import { Data } from "../interface/data";
import { Request } from "express";


@Resolver("Goods")
@UseInterceptors(ExceptionInterceptor)
export class GoodsResolver {

    constructor(
        @Inject(GoodsService) private readonly goodsService: GoodsService
    ) { }

    /* 获取指定分类下所有商品 */
    @Query("goodses")
    async goodses(req: Request, body: { classifyId: number, pageNumber: number, pageSize: number }): Promise<GoodsesData> {
        const { classifyId, pageNumber, pageSize } = body;
        if (!classifyId) {
            throw new HttpException("缺少参数", 400);
        }
        const goodses: Array<Goods> = await this.goodsService.getGoodses(classifyId, pageNumber, pageSize);
        return { code: 200, message: "获取指定分类商品成功", goodses };
    }

    @Query("goods")
    async goods(req: Request, body: { id: number }): Promise<GoodsData> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 400);
        }
        const goods: Goods & any = await this.goodsService.getGoods(id);
        return { code: 200, message: "获取指定商品详情成功", goods };
    }

    @Mutation("createGoods")
    async createGoods(req: Request, body: { name: string, basePrice: number, description: string, classifyId: number, goodsTypeId: number, brandId: number }): Promise<Data> {
        const { name, basePrice, description, classifyId, goodsTypeId , brandId} = body;
        if (!name || !basePrice || !description || !classifyId || !goodsTypeId) {
            throw new HttpException("缺少参数", 400);
        }
        await this.goodsService.createGoods(name, basePrice, description, classifyId, goodsTypeId, brandId);
        return { code: 200, message: "创建商品成功" };
    }

    @Mutation("updateGoods")
    async updateGoods(req: Request, body: { id: number, name: string, basePrice: number, description: string, classifyId: number, goodsTypeId: number, brandId: number }): Promise<Data> {
        const { id, basePrice, description, classifyId, goodsTypeId , brandId} = body;
        if (!id) {
            throw new HttpException("缺少参数", 400);
        }
        await this.goodsService.updateGoods(id, name, basePrice, description, classifyId, goodsTypeId, brandId);
        return { code: 200, message: "更新商品成功" };
    }

    @Mutation("deleteGoods")
    async deleteGoods(req: Request, body: { id: number }): Promise<Data> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 400);
        }
        await this.goodsService.deleteGoods(id);
        return { code: 200, message: "删除商品成功" };
    }
}