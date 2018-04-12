import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { GoodsesData } from "../interface/goods/goodses.data";
import { Resolver, Mutation, Query } from "@nestjs/graphql";
import { GoodsData } from "../interface/goods/goods.data";
import { GoodsService } from "../service/goods.service";
import { Goods } from "../model/goods.entity";
import { Data } from "../interface/data";
import { Request } from "express";

/* 商品Resolver */
@Resolver("Goods")
@UseInterceptors(ExceptionInterceptor)
export class GoodsResolver {

    constructor(
        @Inject(GoodsService) private readonly goodsService: GoodsService
    ) { }

    /* 获取指定分类下所有商品，分类只能是三级分类，不需要分类级别，可以分页获取,不传递分页参数，则获取类型下所有商品 */
    @Query("goodses")
    async goodses(req: Request, body: { classifyId: number, pageNumber: number, pageSize: number }): Promise<GoodsesData> {
        const { classifyId, pageNumber, pageSize } = body;
        if (!classifyId) {
            throw new HttpException("缺少参数", 400);
        }
        const goodses: Array<Goods> = await this.goodsService.getGoodses(classifyId, pageNumber, pageSize);
        return { code: 200, message: "获取指定分类商品成功", goodses };
    }

    /* 获取指定id商品信息，可以获取商品类型以及其下属性，商品的属性值以及关联的属性，用来给商品详情页使用 */
    @Query("goods")
    async goods(req: Request, body: { id: number }): Promise<GoodsData> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 400);
        }
        const goods: Goods & any = await this.goodsService.getGoods(id);
        return { code: 200, message: "获取指定商品详情成功", goods };
    }

    /* 创建指定名称、基本价格、描述、分类、商品类型、品牌的商品，其中只有品牌可以为空*/
    @Mutation("createGoods")
    async createGoods(req: Request, body: { name: string, basePrice: number, description: string, classifyId: number, goodsTypeId: number, brandId: number }): Promise<Data> {
        const { name, basePrice, description, classifyId, goodsTypeId, brandId } = body;
        if (!name || !basePrice || !description || !classifyId || !goodsTypeId) {
            throw new HttpException("缺少参数", 400);
        }
        await this.goodsService.createGoods(name, basePrice, description, classifyId, goodsTypeId, brandId);
        return { code: 200, message: "创建商品成功" };
    }

    /* 更新指定id商品的名称、基本价格、描述、商品分类、商品类型、品牌，只有id是必须的，其他参数不传代表不更新，只有传递的参数才会被更新，因为这些参数基本不能为空
    当更新商品类型时，商品下关联的属性值会被删除*/
    @Mutation("updateGoods")
    async updateGoods(req: Request, body: { id: number, name: string, basePrice: number, description: string, classifyId: number, goodsTypeId: number, brandId: number }): Promise<Data> {
        const { id, basePrice, description, classifyId, goodsTypeId, brandId } = body;
        if (!id) {
            throw new HttpException("缺少参数", 400);
        }
        await this.goodsService.updateGoods(id, name, basePrice, description, classifyId, goodsTypeId, brandId);
        return { code: 200, message: "更新商品成功" };
    }

    /* 删除指定id商品，删除商品时，其下所有属性值都会被删除 */
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