import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { Resolver, Query, Mutation } from "@nestjs/graphql";
import { SkusData } from "../interface/sku/skus.data";
import { SkuService } from "../service/sku.service";
import { Data } from "../interface/data";
import { Request } from "express";

/* Sku的Resolver */
@Resolver("Sku")
@UseInterceptors(ExceptionInterceptor)
export class SkuResolver {

    constructor(
        @Inject(SkuService) private readonly skuService: SkuService
    ) { }

    @Query("skus")
    async skus(req: Request, body: { goodsId: number }): Promise<SkusData> {
        const { goodsId } = body;
        if (!goodsId) {
            throw new HttpException("缺少参数", 404);
        }
        const skus = await this.skuService.getSkus(goodsId);
        return { code: 200, message: "获取指定商品Sku成功", skus };
    }

    @Mutation("createSku")
    async createSku(req: Request, body: { goodsId: number, no: string, inventory: number, propertyValueIds: Array<number> }): Promise<Data> {
        const { goodsId, no, inventory, propertyValueIds } = body;
        if (!goodsId || !no || !inventory || !propertyValueIds || propertyValueIds.length === 0) {
            throw new HttpException("缺少参数", 404);
        }
        await this.skuService.createSku(goodsId, no, inventory, propertyValueIds);
        return { code: 200, message: "创建Sku成功" };
    }

    @Mutation("updateSku")
    async updateSku(req: Request, body: { id: number, no: string, inventory: number, propertyValueIds: Array<number> }): Promise<Data> {
        const { id, no, inventory, propertyValueIds } = body;
        if (!id) {
            throw new HttpException("缺少参数", 404);
        }
        await this.skuService.updateSku(id, no, inventory, propertyValueIds);
        return { code: 200, message: "更新Sku成功" };
    }

    @Mutation("deleteSku")
    async deleteSku(req: Request, body: { id: number }): Promise<Data> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 404);
        }
        await this.skuService.deleteSku(id);
        return { code: 200, message: "删除Sku成功" };
    }
}