import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { GoodsPropertyService } from "../service/goods.property.service";
import { Resolver, Query, Mutation } from "@nestjs/graphql";
import { Data } from "../interface/data";
import { Request } from "express";


/* 商品属性Resolver，没有什么Query，查询商品类型时会顺带查询其下商品属性 */
@Resolver("GoodsProperty")
@UseInterceptors(ExceptionInterceptor)
export class GoodsPropertyResolver {

    constructor(
        @Inject(GoodsPropertyService) private readonly goodsPropertyService: GoodsPropertyService
    ) { }

    /* 创建指定商品类型下，指定名称、类型、输入类型、列表值的商品属性 */
    @Mutation("createGoodsProperty")
    async createGoodsProperty(req: Request, body: { goodsTypeId: number, name: string, type: "unique" | "radio" | "check", inputType: "text" | "list" | "textarea", list: Array<string> }): Promise<Data> {
        const { goodsTypeId, name, type, inputType, list } = body;
        /* list只有在输入类为list时才会存在 */
        if (!goodsTypeId || !name || !type || !inputType) {
            throw new HttpException("缺少参数", 404);
        }
        if (type !== "unique" && type !== "radio" && type !== "check") {
            throw new HttpException("type参数不正确", 404);
        }
        if (inputType !== "text" && inputType !== "list" && inputType !== "textarea") {
            throw new HttpException("inputType参数不正确", 404);
        }
        if (inputType === "list" && !list) {
            throw new HttpException("输入类型为list时，list列表值必须存在", 404);
        }
        await this.goodsPropertyService.createGoodsProperty(goodsTypeId, name, type, inputType, list);
        return { code: 200, message: "创建商品属性成功" };
    }

    /* 更新指定id商品属性，可以更新名称、类型、输入类型、列表值，不能更新所属商品类型 */
    @Mutation("updateGoodsProperty")
    async updateGoodsProperty(req: Request, body: { id: number, name: string, type: "unique" | "radio" | "check", inputType: "text" | "list" | "textarea", list: Array<string> }): Promise<Data> {
        const { id, name, type, inputType, list } = body;
        if (!id) {
            throw new HttpException("缺少参数", 404);
        }
        /* 默认认为更新输入类型为list时，必须同时更新列表值 */
        if (inputType === "list" && !list) {
            throw new HttpException("输入类型为list时，list列表值必须存在", 404);
        }
        await this.goodsPropertyService.updateGoodsProperty(id, name, type, inputType, list);
        return { code: 200, message: "更新商品属性成功" };
    }

    /* 删除指定商品属性，这个属性关联的属性值也会被删除 */
    @Mutation("deleteGoodsProperty")
    async deleteGoodsProperty(req: Request, body: { id: number }): Promise<Data> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 404);
        }
        await this.goodsPropertyService.deleteGoodsProperty(id);
        return { code: 200, message: "删除商品属性成功" };
    }

}