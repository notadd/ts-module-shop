import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { Resolver, Query, Mutation } from "@nestjs/graphql";
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

    @Mutation("createSku")
    async createSku(req: Request, body: { goodsId: number, inventory: number, propertyValueIds: Array<number> }): Promise<Data> {
        const { goodsId, inventory, propertyValueIds} = body;
        if (!goodsId || !inventory || !propertyValueIds || propertyValueIds.length === 0) {
            throw new HttpException("缺少参数", 404);
        }
        await this.skuService.createSku(goodsId, inventory, propertyValueIds);
        return {code: 200, message: "创建Sku成功"};
    }
}