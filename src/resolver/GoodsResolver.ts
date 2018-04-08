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
    async createGoods(req: Request, body: { name: string, description: string }): Promise<Data> {
        let { name, description } = body;
        if (!name || !description) {
            throw new HttpException('缺少参数', 400)
        }
        await this.goodsService.createGoods(name, description)
        return { code: 200, message: '创建商品成功' }
    }
}