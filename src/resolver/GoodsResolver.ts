import { ExceptionInterceptor } from '../interceptor/ExceptionInterceptor';
import { Inject, HttpException, UseInterceptors } from '@nestjs/common';
import { Resolver, Mutation, Query } from '@nestjs/graphql';
import { GoodsService } from '../service/GoodsService';
import { Goods } from '../interface/goods/Goods';
import { Data } from '../interface/Data';


@Resolver('Goods')
@UseInterceptors(ExceptionInterceptor)
export class GoodsResolver {

    constructor(
        @Inject(GoodsService) private readonly goodsService: GoodsService
    ) { }

    /* 获取指定分类下所有商品 */
    @Query('goodses')
    async goodses(req: Request, body: { classifyId: number, pageNumber: number, pageSize: number }): Promise<Data & { goodses: Goods[] }> {
        let { classifyId, pageNumber, pageSize } = body
        if (!classifyId) {
            throw new HttpException('缺少参数', 400)
        }
        let goodses: Goods[] = await this.goodsService.getGoodses(classifyId, pageNumber, pageSize)
        return { code: 200, message: '获取指定分类商品成功', goodses }
    }

    @Query('goods')
    async goods(req: Request, body: { id: number }): Promise<Data & { goods: Goods & any }> {
        let { id } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        let goods: Goods & any = await this.goodsService.getGoods(id)
        return { code: 200, message: '获取指定商品详情成功', goods }
    }

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
        let { id, basePrice, description, classifyId, goodsTypeId } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        await this.goodsService.updateGoods(id, name, basePrice, description, classifyId, goodsTypeId)
        return { code: 200, message: '更新商品成功' }
    }

    @Mutation('deleteGoods')
    async deleteGoods(req: Request, body: { id: number }): Promise<Data> {
        let { id } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        await this.goodsService.deleteGoods(id)
        return { code: 200, message: '删除商品成功' }
    }
}