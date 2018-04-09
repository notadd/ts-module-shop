import { ExceptionInterceptor } from '../interceptor/ExceptionInterceptor';
import { Inject, HttpException, UseInterceptors } from '@nestjs/common';
import { GoodsPropertyService } from '../service/GoodsPropertyService';
import { Resolver, Query, Mutation } from '@nestjs/graphql'
import { Data } from '../interface/Data';
import { Request } from 'express';

@Resolver('GoodsProperty')
export class GoodsPropertyResolver {

    constructor(
        @Inject(GoodsPropertyService) private readonly goodsPropertyService:GoodsPropertyService
    ) { }

}