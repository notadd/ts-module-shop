import { ExceptionInterceptor } from '../interceptor/ExceptionInterceptor';
import { Inject, HttpException, UseInterceptors } from '@nestjs/common';
import { GoodsPropertyService } from '../service/GoodsPropertyService';
import { Resolver, Query, Mutation } from '@nestjs/graphql'
import { Data } from '../interface/Data';
import { Request } from 'express';

@Resolver('GoodsProperty')
@UseInterceptors(ExceptionInterceptor)
export class GoodsPropertyResolver {

    constructor(
        @Inject(GoodsPropertyService) private readonly goodsPropertyService: GoodsPropertyService
    ) { }

    @Mutation('createGoodsProperty')
    async createGoodsProperty(req: Request, body: { goodsTypeId: number, name: string, type: 'unique' | 'radio' | 'check', inputType: 'text' | 'list' | 'textarea', list: string[] }): Promise<Data> {
        let { goodsTypeId, name, type, inputType, list } = body
        if (!goodsTypeId || !name || !type || !inputType) {
            throw new HttpException('缺少参数', 404)
        }
        if (type !== 'unique' && type !== 'radio' && type !== 'check') {
            throw new HttpException('type参数不正确', 404)
        }
        if (inputType !== 'text' && inputType !== 'list' && inputType !== 'textarea') {
            throw new HttpException('inputType参数不正确', 404)
        }
        if (inputType === 'list' && !list) {
            throw new HttpException('输入类型为list时，list列表值必须存在', 404)
        }
        await this.goodsPropertyService.createGoodsProperty(goodsTypeId, name, type, inputType, list)
        return { code: 200, message: '创建商品属性成功' }
    }

    @Mutation('updateGoodsProperty')
    async updateGoodsProperty(req: Request, body: { id: number, name: string, type: 'unique' | 'radio' | 'check', inputType: 'text' | 'list' | 'textarea', list: string[] }): Promise<Data> {
        let { id, name, type, inputType, list } = body
        if (!id) {
            throw new HttpException('缺少参数', 404)
        }
        if (inputType === 'list' && !list) {
            throw new HttpException('输入类型为list时，list列表值必须存在', 404)
        }
        await this.goodsPropertyService.updateGoodsProperty(id, name, type, inputType, list)
        return { code: 200, message: '更新商品属性成功' }
    }

    /* 删除指定商品属性，这个属性关联的属性值也会被删除 */
    @Mutation('deleteGoodsProperty')
    async deleteGoodsProperty(req: Request, body: { id: number }): Promise<Data> {
        let { id } = body
        if (!id) {
            throw new HttpException('缺少参数', 404)
        }
        await this.goodsPropertyService.deleteGoodsProperty(id)
        return { code: 200, message: '删除商品属性成功' }
    }

}