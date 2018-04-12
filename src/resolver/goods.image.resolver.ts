import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { GoodsImageService } from "../service/goods.image.service";
import { Resolver, Query, Mutation } from "@nestjs/graphql";
import { Data } from "../interface/data";
import { Request } from "express";


/* 商品图片的Resolver */
@Resolver("GoodsImage")
@UseInterceptors(ExceptionInterceptor)
export class GoodsImageResolver {

    constructor(
        @Inject(GoodsImageService) private readonly goodsImageService: GoodsImageService
    ) { }

}
