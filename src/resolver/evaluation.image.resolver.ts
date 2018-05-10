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

    @Mutation("createEvaluationImage")
    async createEvaluationImage(req: Request, body: { evaluationId: number, bucketName: string, rawName: string, base64: string }): Promise<Data> {
        const { evaluationId, bucketName, rawName, base64 } = body;
        if (!evaluationId || !bucketName || !rawName || !base64) {
            throw new HttpException("缺少参数", 400);
        }
        await this.evaluationImageService.createEvaluationImage(evaluationId, bucketName, rawName, base64);
        return { code: 200, message: "创建评价图片成功" };
    }

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
