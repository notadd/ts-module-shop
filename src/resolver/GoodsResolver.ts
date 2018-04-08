import { ExceptionInterceptor } from '../interceptor/ExceptionInterceptor';
import { Inject, HttpException, UseInterceptors } from '@nestjs/common';
import { Resolver, Mutation, Query } from '@nestjs/graphql';
import { GoodsService } from '../service/GoodsService';
import { Data } from '../interface/Data';


@Resolver('Goods')
@UseInterceptors(ExceptionInterceptor)
export class GoodsResolver {

    constructor(
        @Inject(GoodsService) private readonly goodsService: GoodsService
    ) { }

    @Mutation('createGoods')
    async createGoods(req: Request, body: { name: string, basePrice: number, description: string, classifyId: number, goodsTypeId: number }): Promise<Data> {
        let { name, basePrice, description, classifyId, goodsTypeId } = body;
        if (!name || !basePrice || !description || !classifyId || !goodsTypeId) {
            throw new HttpException('缺少参数', 400)
        }
        await this.goodsService.createGoods(name, basePrice, description, classifyId, goodsTypeId)
        return { code: 200, message: '创建商品成功' }
    }

    @Mutation('updateGoods')
    async updateGoods(req: Request, body: { id: number, name: string, basePrice: number, description: string, classifyId: number, goodsTypeId: number }): Promise<Data> {
        let { id } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        await this.goodsService.updateGoods(id, name, basePrice, description, classifyId, goodsTypeId)
        return { code: 200, message: '更新商品成功' }
    }
}