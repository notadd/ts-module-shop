import { Resolver,Query,Mutation } from '@nestjs/graphql'
import { Inject,HttpException } from '@nestjs/common';

@Resolver('GoodsTyoe')
export class GoodsTypeResolver{

    constructor(
        @Inject() 
    ){}

}
