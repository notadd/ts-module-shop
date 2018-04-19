import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { Resolver, Query, Mutation } from "@nestjs/graphql";
import { SkuService } from "../service/sku.service";
import { Data } from "../interface/data";
import { Request } from "express";


/* Sku的Resolver */
@Resolver("Sku")
@UseInterceptors(ExceptionInterceptor)
export class SkuResolver {

    constructor(
        @Inject(SkuService) private readonly skuService: SkuService
    ) { }
}