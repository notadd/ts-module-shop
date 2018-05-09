import { Component, HttpException } from "@nestjs/common";
import { Evaluation } from "../model/evaluation.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

/* 评价的服务组件 */
@Component()
export class EvaluationService {

    constructor(
        @InjectRepository(Evaluation) private readonly evaluationRepository: Repository<Evaluation>
    ) { }
}
