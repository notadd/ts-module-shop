import { ExceptionInterceptor } from '../interceptor/ExceptionInterceptor';
import { Inject, HttpException, UseInterceptors } from '@nestjs/common';
import { PropertyValueService } from '../service/PropertyValueService';
import { Resolver, Query, Mutation } from '@nestjs/graphql'
import { Data } from '../interface/Data';
import { Request } from 'express';

@Resolver('PropertyValue')
export class PropertyValueResolver {

    constructor(
        @Inject(PropertyValueService) private readonly propertyValueService: PropertyValueService
    ) { }

    @Mutation('createPropertyValue')
    async createPropertyValue(req: Request, body: { goodsId: number, goodsPropertyId: number, value: string, price: number }): Promise<Data> {
        let { goodsId, goodsPropertyId, value, price } = body
        if (!goodsId || !goodsPropertyId || !value) {
            throw new HttpException('缺少参数', 404)
        }
        await this.propertyValueService.createPropertyValue(goodsId, goodsPropertyId, value, price)
        return { code: 200, message: '创建属性值成功' }
    }

    @Mutation('updatePropertyValue')
    async updatePropertyValue(req: Request, body: { id: number, value: string, price: number }): Promise<Data> {
        let { id, value, price } = body
        if (!id) {
            throw new HttpException('缺少参数', 404)
        }
        await this.propertyValueService.updatePropertyValue(id, value, price)
        return { code: 200, message: '更新属性值成功' }
    }
}