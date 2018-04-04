import { ExceptionInterceptor } from '../interceptor/ExceptionInterceptor';
import { Inject, HttpException, UseInterceptors } from '@nestjs/common';
import { ClassifyService } from '../service/ClassifyService';
import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { Data } from '../interface/Data';
import { Request } from 'express';



@Resolver('Classify')
@UseInterceptors(ExceptionInterceptor)
export class ClassifyResolver {

    constructor(
        @Inject(ClassifyService) private readonly classifyService: ClassifyService
    ) { }

    @Mutation('createClassify')
    async createClassify(req: Request, body: { name: string, description: string, level: 1 | 2 | 3 }): Promise<Data> {
        let { name, description, level } = body
        if (!name || !description || !level) {
            throw new HttpException('缺少参数', 400)
        }
        if (level !== 1 && level !== 2 && level !== 3) {
            throw new HttpException('参数错误', 400)
        }
        await this.classifyService.createClassify(name, description, level)
        return { code: 200, message: '创建分类成功' }
    }
}