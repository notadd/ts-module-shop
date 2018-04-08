import { ExceptionInterceptor } from '../interceptor/ExceptionInterceptor';
import { Inject,HttpException,UseInterceptors } from '@nestjs/common';
import { Resolver,Mutation,Query } from '@nestjs/graphql'
import { Data } from '../interface/Data';

@Resolver('Goods')
export class GoodsResolver{

    constructor(){}

    @Mutation('createGoods')
    async createGoods(req:Request,body:{}):Promise<Data>{
        
    }
}