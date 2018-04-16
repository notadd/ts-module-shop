import { PropertyValuesData } from "../interface/propertyvalue/property.values.data";
import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { PropertyValueService } from "../service/property.value.service";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { PropertyValue } from "../model/property.value.entity";
import { Resolver, Query, Mutation } from "@nestjs/graphql";
import { Data } from "../interface/data";
import { Request } from "express";


/* 属性值的Resolver,属性值的查询在商品详情里面，获取单个商品时会获取其关联属性值 */
@Resolver("PropertyValue")
export class PropertyValueResolver {

    constructor(
        @Inject(PropertyValueService) private readonly propertyValueService: PropertyValueService
    ) { }

    @Query("propertyValues")
    async propertyValues(req: Request, body: { goodsId: number }): Promise<PropertyValuesData> {
        const { goodsId } = body;
        if (!goodsId) {
            throw new HttpException("缺少参数", 404);
        }
        const values: Array<PropertyValue> = await this.propertyValueService.getPropertyValues(goodsId);
        return { code: 200, message: "获取指定商品的所有属性值成功", values };
    }

    /* 添加指定商品、指定属性的一个属性值，规则为
    指定属性从属于指定商品的商品类型，不能是随意属性
    唯一属性不需要传递价格，单选、复选属性需要价格，也就是价格与属性类型有关
    当录入类型是list时，value必须被list包含，不能是随意值，也就是属性值与属性的输入类型有关*/
    @Mutation("createPropertyValue")
    async createPropertyValue(req: Request, body: { goodsId: number, goodsPropertyId: number, value: string, price: number }): Promise<Data> {
        const { goodsId, goodsPropertyId, value, price } = body;
        if (!goodsId || !goodsPropertyId || !value) {
            throw new HttpException("缺少参数", 404);
        }
        await this.propertyValueService.createPropertyValue(goodsId, goodsPropertyId, value, price);
        return { code: 200, message: "创建属性值成功" };
    }

    /* 更新指定id属性值，只能更新属性值与价格 */
    @Mutation("updatePropertyValue")
    async updatePropertyValue(req: Request, body: { id: number, value: string, price: number }): Promise<Data> {
        const { id, value, price } = body;
        if (!id) {
            throw new HttpException("缺少参数", 404);
        }
        await this.propertyValueService.updatePropertyValue(id, value, price);
        return { code: 200, message: "更新属性值成功" };
    }

    /* 删除指定id属性值，不管是唯一属性、单选、复选属性都可以删除 */
    @Mutation("deletePropertyValue")
    async deletePropertyValue(req: Request, body: { id: number }): Promise<Data> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 404);
        }
        await this.propertyValueService.deletePropertyValue(id);
        return { code: 200, message: "删除属性值成功" };
    }
}