import { ExceptionInterceptor } from '../interceptor/ExceptionInterceptor';
import { Inject, HttpException, UseInterceptors } from '@nestjs/common';
import { GoodsTypeService } from '../service/GoodsTypeService';
import { Resolver, Query, Mutation } from '@nestjs/graphql'
import { Data } from '../interface/Data';
import { Request } from 'express';

@Resolver('GoodsTyoe')
@UseInterceptors(ExceptionInterceptor)
export class GoodsTypeResolver {

    constructor(
        @Inject(GoodsTypeService) private readonly goodsTypeService: GoodsTypeService
    ) { }

    @Mutation('createGoodsType')
    async createGoodsType(req: Request, body: { name: string }): Promise<Data> {
        let { name } = body
        if (!name) {
            throw new HttpException('缺少参数', 404)
        }
        await this.goodsTypeService.createGoodsType(name)
        return { code: 200, message: '创建商品类型成功' }
    }

    @Mutation('updateGoodsType')
    async updateGoodsType(req:Request,body:{id:number,name:string}):Promise<Data>{
        let {id,name} = body
        if(!id){
            throw new HttpException('缺少参数',404)
        }
        await this.goodsTypeService.updateGoodsType(id,name)
        return {code:200,message:'更新商品类型成功'}
    }



}
