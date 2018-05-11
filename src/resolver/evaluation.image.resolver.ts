import { EvaluationImagesData } from "../interface/evaluationimage/evaluation.images.data";
import { EvaluationImageService } from "../service/evaluation.image.service";
import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { Resolver, Query, Mutation } from "@nestjs/graphql";
import { Data } from "../interface/data";
import { Request } from "express";

/* 评价图片Resolver */
@Resolver("EvaluationImage")
@UseInterceptors(ExceptionInterceptor)
export class EvaluationImageResolver {

    constructor(
        @Inject(EvaluationImageService) private readonly evaluationImageService: EvaluationImageService
    ) { }

    /* 查询指定评价的图片，同时返回图片访问url */
    @Query("evaluationImages")
    async evaluationImages(req: Request, body: { evaluationId: number }): Promise<EvaluationImagesData> {
        const { evaluationId } = body;
        console.log(evaluationId)
        if (!evaluationId) {
            throw new HttpException("缺少参数", 400);
        }
        const images = await this.evaluationImageService.getEvaluationImages(req, evaluationId);
        return { code: 200, message: "获取指定评价的图片成功", images };
    }

    /* 为指定评价添加一张图片，创建评价时也可以添加图片 */
    @Mutation("createEvaluationImage")
    async createEvaluationImage(req: Request, body: { evaluationId: number, bucketName: string, rawName: string, base64: string }): Promise<Data> {
        const { evaluationId, bucketName, rawName, base64 } = body;
        if (!evaluationId || !bucketName || !rawName || !base64) {
            throw new HttpException("缺少参数", 400);
        }
        await this.evaluationImageService.createEvaluationImage(evaluationId, bucketName, rawName, base64);
        return { code: 200, message: "创建评价图片成功" };
    }

    /* 删除指定评价图片，同时删除存储图片 */
    @Mutation("deleteEvaluationImage")
    async deleteEvaluationImage(req: Request, body: { id: number }): Promise<Data> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 400);
        }
        await this.evaluationImageService.deleteEvaluationImage(id);
        return { code: 200, message: "删除评价图片成功" };
    }
}
