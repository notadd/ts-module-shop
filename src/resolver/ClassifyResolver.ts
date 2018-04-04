import { ExceptionInterceptor } from '../interceptor/ExceptionInterceptor';
import { Inject, HttpException, UseInterceptors } from '@nestjs/common';
import { ClassifyService } from '../service/ClassifyService';
import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { Classify } from '../interface/classify/Classify';
import { Data } from '../interface/Data';
import { Request } from 'express';



@Resolver('Classify')
@UseInterceptors(ExceptionInterceptor)
export class ClassifyResolver {

    constructor(
        @Inject(ClassifyService) private readonly classifyService: ClassifyService
    ) { }

    @Query('classifies')
    async classifies(req: Request, body: { parentId: number, level: 1 | 2 | 3 }): Promise<Data & { classifes: Classify[] }> {
        let { parentId, level } = body
        if (level !== 1 && level !== 2 && level !== 3) {
            throw new HttpException('参数错误', 400)
        }
        let classifes: Classify[] = await this.classifyService.getClassifes(parentId, level)
        return { code: 200, message: '获取指定分类成功', classifes }
    }

    @Query('classify')
    async classify(req: Request, body: { id: number, level: 1 | 2 | 3 }): Promise<Data & { classify: Classify }> {
        let { id, level } = body
        if (!id || !level) {
            throw new HttpException('缺少参数', 400)
        }
        if (level !== 1 && level !== 2 && level !== 3) {
            throw new HttpException('参数错误', 400)
        }
        let classify: Classify = await this.classifyService.getClassify(id, level)
        return { code: 200, message: '获取指定分类成功', classify }
    }

    @Mutation('createClassify')
    async createClassify(req: Request, body: { name: string, description: string, level: 1 | 2 | 3, parentId: number }): Promise<Data> {
        let { name, description, level, parentId } = body
        if (!name || !description || !level) {
            throw new HttpException('缺少参数', 400)
        }
        if (level !== 1 && level !== 2 && level !== 3) {
            throw new HttpException('参数错误', 400)
        }
        if (level !== 1 && !parentId) {
            throw new HttpException('缺少上级分类', 400)
        }
        await this.classifyService.createClassify(name, description, level, parentId)
        return { code: 200, message: '创建分类成功' }
    }

    @Mutation('updateClassify')
    async updateClassify(req: Request, body: { id: number, name: string, description: string, level: 1 | 2 | 3 }): Promise<Data> {
        let { id, name, description, level } = body
        if (!id || !name || !description || !level) {
            throw new HttpException('缺少参数', 400)
        }
        if (level !== 1 && level !== 2 && level !== 3) {
            throw new HttpException('参数错误', 400)
        }
        await this.classifyService.updateClassify(id, name, description, level)
        return { code: 200, message: '更新分类成功' }
    }

    @Mutation('deleteClassify')
    async deleteClassify(req: Request, body: { id: number, level: 1 | 2 | 3 }): Promise<Data> {
        let { id, level } = body
        if (!id || !level) {
            throw new HttpException('缺少参数', 400)
        }
        if (level !== 1 && level !== 2 && level !== 3) {
            throw new HttpException('参数错误', 400)
        }
        await this.classifyService.deleteClassify(id, level)
        return { code: 200, message: '删除分类成功' }
    }
}