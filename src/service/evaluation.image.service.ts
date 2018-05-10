import { EvaluationImage } from "../model/evaluation.image.entity";
import { Component, HttpException, Inject } from "@nestjs/common";
import { StoreComponent } from "../interface/store.component";
import { Evaluation } from "../model/evaluation.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

/* 评价图片的服务组件 */
@Component()
export class EvaluationImageService {

    constructor(
        @Inject("StoreComponentToken") private readonly storeComponent: StoreComponent,
        @InjectRepository(Evaluation) private readonly evaluationRepository: Repository<Evaluation>,
        @InjectRepository(EvaluationImage) private readonly evaluationImageRepository: Repository<EvaluationImage>
    ) { }

}
