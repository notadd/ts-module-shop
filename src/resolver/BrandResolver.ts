import { ExceptionInterceptor } from '../interceptor/ExceptionInterceptor';
import { Inject, HttpException, UseInterceptors } from '@nestjs/common';
import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { BrandService } from '../service/BrandService';
import { Data } from '../interface/Data';
import { Request } from 'express';



@Resolver('Brand')
@UseInterceptors(ExceptionInterceptor)
export class BrandResolver {

    constructor(
        @Inject(BrandService) private readonly brandService: BrandService
    ) { }

}