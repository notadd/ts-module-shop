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

    @Mutation('createBrand')
    async createBrand(req: Request, body: { name: string }): Promise<Data> {
        let { name } = body
        if (!name) {
            throw new HttpException('缺少参数', 404)
        }
        await this.brandService.createBrand(name)
        return { code: 200, message: '创建品牌成功' }
    }

    @Mutation('updateBrand')
    async updateBrand(req: Request, body: { id: number, name: string }): Promise<Data> {
        let { id,name } = body
        if (!id||!name) {
            throw new HttpException('缺少参数', 404)
        }
        await this.brandService.updateBrand(id,name)
        return { code: 200, message: '更新品牌成功' }
    }

}