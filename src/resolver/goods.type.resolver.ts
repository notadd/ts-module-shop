import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { GoodsTypesData } from "../interface/goodstype/goods.types.data";
import { GoodsTypeData } from "../interface/goodstype/goods.type.data";
import { GoodsTypeService } from "../service/goods.type.service";
import { Resolver, Query, Mutation } from "@nestjs/graphql";
import { Data } from "../interface/data";
import { Request } from "express";

/* 商品类型Resolver */
@Resolver("GoodsTyoe")
@UseInterceptors(ExceptionInterceptor)
export class GoodsTypeResolver {

    constructor(
        @Inject(GoodsTypeService) private readonly goodsTypeService: GoodsTypeService
    ) { }

    /* 获取所有商品类型，创建商品时用来供前端选择 */
    @Query("goodsTypes")
    async goodsTypes(req: Request): Promise<GoodsTypesData> {
        const goodsTypes: Array<{ id: number, name: string }> = await this.goodsTypeService.getGoodsTypes();
        return { code: 200, message: "获取所有商品类型成功", goodsTypes };
    }

    /* 获取指定商品类型详细数据，包括其下商品属性，当为商品添加属性值时，通过这个接口获取商品类型下属性 */
    @Query("goodsType")
    async goodsType(req: Request, body: { id: number }): Promise<GoodsTypeData> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 404);
        }
        const goodsType: any = await this.goodsTypeService.getGoodsType(id);
        return { code: 200, message: "获取指定商品类型信息成功", goodsType };
    }

    /* 创建指定名称商品类型，创建时其下没有属性 */
    @Mutation("createGoodsType")
    async createGoodsType(req: Request, body: { name: string }): Promise<Data> {
        const { name } = body;
        if (!name) {
            throw new HttpException("缺少参数", 404);
        }
        await this.goodsTypeService.createGoodsType(name);
        return { code: 200, message: "创建商品类型成功" };
    }

    /* 更新指定id商品类型，只能更新名称 */
    @Mutation("updateGoodsType")
    async updateGoodsType(req: Request, body: { id: number, name: string }): Promise<Data> {
        const { id, name } = body;
        if (!id) {
            throw new HttpException("缺少参数", 404);
        }
        await this.goodsTypeService.updateGoodsType(id, name);
        return { code: 200, message: "更新商品类型成功" };
    }

    /* 删除指定id商品类型，商品类型下有商品时不能删除，如果没有商品，则删除指定商品类型，关联删除其下商品属性 */
    @Mutation("deleteGoodsType")
    async deleteGoodsType(req: Request, body: { id: number }): Promise<Data> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 404);
        }
        await this.goodsTypeService.deleteGoodsType(id);
        return { code: 200, message: "删除商品类型成功" };
    }

}
