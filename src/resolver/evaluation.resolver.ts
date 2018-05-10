import { InputEvaluationImage } from "../interface/evaluation/input.evaluation.image";
import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { EvaluationService } from "../service/evaluation.service";
import { Resolver, Query, Mutation } from "@nestjs/graphql";
import { Data } from "../interface/data";
import { Request } from "express";

/* 评价Resolver */
@Resolver("Evaluation")
@UseInterceptors(ExceptionInterceptor)
export class EvaluationResolver {

    constructor(
        @Inject(EvaluationService) private readonly evaluationService: EvaluationService
    ) { }

    @Query("evaluation")
    async evaluation(req: Request, body: { id: number }): Promise<any> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 400);
        }
        const evaluation = await this.evaluationService.getEvaluation(id);
        return { code: 200, message: "获取指定评价信息成功", evaluation };
    }

    /* 获取指定商品的所有评价 */
    @Query("evaluations")
    async evaluations(req: Request, body: { goodsId: number }): Promise<any> {
        const { goodsId } = body;
        if (!goodsId) {
            throw new HttpException("缺少参数", 404);
        }
        const evaluations = await this.evaluationService.getEvaluations(goodsId);
        return { code: 200, message: "获取指定商品评价成功", evaluations };
    }

    @Mutation("createEvaluation")
    async createEvaluation(req: Request, body: { content: string, userId: number, orderItemId: number, images: Array<InputEvaluationImage> }): Promise<Data> {
        const { content, userId, orderItemId } = body;
        if (!content || !userId || !orderItemId) {
            throw new HttpException("缺少参数", 400);
        }
        await this.evaluationService.createEvaluation(content, userId, orderItemId);
        return { code: 200, message: "创建评价成功" };
    }

    @Mutation("updateEvaluation")
    async updateEvaluation(req: Request, body: { id: number, content: string, display: string }): Promise<Data> {
        const { id, content, display } = body;
        if (!id || !content || display === undefined || display === null) {
            throw new HttpException("缺少参数", 404);
        }
        await this.evaluationService.updateEvaluation(id, content, display);
        return { code: 200, message: "更新评价成功" };
    }

    @Mutation("deleteEvaluation")
    async deleteEvaluation(req: Request, body: { id: number }): Promise<Data> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 400);
        }
        await this.evaluationService.deleteEvaluation(id);
        return { code: 200, message: "删除评价成功" };
    }

}
