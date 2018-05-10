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

}
