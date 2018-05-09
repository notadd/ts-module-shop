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

}
