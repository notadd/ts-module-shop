import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { ClassifyService } from "../service/classify.service";
import { Resolver, Query, Mutation } from "@nestjs/graphql";
import { Classify } from "../interface/classify/classify";
import { Data } from "../interface/data";
import { Request } from "express";


/* 商品分类Resolver */
@Resolver("Classify")
@UseInterceptors(ExceptionInterceptor)
export class ClassifyResolver {

    constructor(
        @Inject(ClassifyService) private readonly classifyService: ClassifyService
    ) { }

    /* 获取多个指定级别分类，如果未指定上级分类，则获取这个级别所有分类，如果指定上级分类，则获取这个上级分类下的所有分类，获取一级分类不需要上级分类 */
    @Query("classifies")
    async classifies(req: Request, body: { parentId: number, level: 1 | 2 | 3 }): Promise<Data & { classifes: Array<Classify> }> {
        const { parentId, level } = body;
        if (level !== 1 && level !== 2 && level !== 3) {
            throw new HttpException("参数错误", 400);
        }
        const classifes: Array<Classify> = await this.classifyService.getClassifes(parentId, level);
        return { code: 200, message: "获取指定分类成功", classifes };
    }

    /* 获取指定id、级别分类的信息，由于分类在内部存储为三个实体类，所以必须指定级别 */
    @Query("classify")
    async classify(req: Request, body: { id: number, level: 1 | 2 | 3 }): Promise<Data & { classify: Classify }> {
        const { id, level } = body;
        if (!id || !level) {
            throw new HttpException("缺少参数", 400);
        }
        if (level !== 1 && level !== 2 && level !== 3) {
            throw new HttpException("参数错误", 400);
        }
        const classify: any = await this.classifyService.getClassify(id, level);
        return { code: 200, message: "获取指定分类成功", classify };
    }

    /* 创建指定名称、描述、级别的分类，级别参数必须传递，二、三级分类必须传递父分类id */
    @Mutation("createClassify")
    async createClassify(req: Request, body: { name: string, description: string, level: 1 | 2 | 3, parentId: number }): Promise<Data> {
        const { name, description, level, parentId } = body;
        if (!name || !description || !level) {
            throw new HttpException("缺少参数", 400);
        }
        if (level !== 1 && level !== 2 && level !== 3) {
            throw new HttpException("参数错误", 400);
        }
        if (level !== 1 && !parentId) {
            throw new HttpException("缺少上级分类", 400);
        }
        await this.classifyService.createClassify(name, description, level, parentId);
        return { code: 200, message: "创建分类成功" };
    }

    /* 更新指定id、级别的分类，被更新字段为名称、描述 */
    @Mutation("updateClassify")
    async updateClassify(req: Request, body: { id: number, name: string, description: string, level: 1 | 2 | 3 }): Promise<Data> {
        const { id, name, description, level } = body;
        if (!id || !name || !description || !level) {
            throw new HttpException("缺少参数", 400);
        }
        if (level !== 1 && level !== 2 && level !== 3) {
            throw new HttpException("参数错误", 400);
        }
        await this.classifyService.updateClassify(id, name, description, level);
        return { code: 200, message: "更新分类成功" };
    }

    /* 删除指定id、级别的分类，指定一、二级分类下存在分类或者三级分类下存在商品，不能删除 */
    @Mutation("deleteClassify")
    async deleteClassify(req: Request, body: { id: number, level: 1 | 2 | 3 }): Promise<Data> {
        const { id, level } = body;
        if (!id || !level) {
            throw new HttpException("缺少参数", 400);
        }
        if (level !== 1 && level !== 2 && level !== 3) {
            throw new HttpException("参数错误", 400);
        }
        await this.classifyService.deleteClassify(id, level);
        return { code: 200, message: "删除分类成功" };
    }
}