import { OutEvaluationImage } from "../interface/evaluationimage/evaluation.images.data";
import { EvaluationImage } from "../model/evaluation.image.entity";
import { Component, HttpException, Inject } from "@nestjs/common";
import { StoreComponent } from "../interface/store.component";
import { Evaluation } from "../model/evaluation.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request } from "express";

/* 评价图片的服务组件 */
@Component()
export class EvaluationImageService {

    constructor(
        @Inject("StoreComponentToken") private readonly storeComponent: StoreComponent,
        @InjectRepository(Evaluation) private readonly evaluationRepository: Repository<Evaluation>,
        @InjectRepository(EvaluationImage) private readonly evaluationImageRepository: Repository<EvaluationImage>
    ) { }

    async getEvaluationImages(req: Request, evaluationId: number): Promise<Array<OutEvaluationImage>> {
        const evaluation: Evaluation | undefined = await this.evaluationRepository.findOneById(evaluationId);
        if (!evaluation) {
            throw new HttpException("指定id=" + evaluationId + "评价不存在", 404);
        }
        const images: Array<any> | undefined = await this.evaluationImageRepository.find({ evaluationId });
        for (let i = 0; i < images.length; i++) {
            images[i].url = await this.storeComponent.getUrl(req, images[i].bucketName, images[i].name, images[i].type, undefined);
        }
        return images;
    }

    async createEvaluationImage(evaluationId: number, bucketName: string, rawName: string, base64: string): Promise<void> {
        const evaluation: Evaluation | undefined = await this.evaluationRepository.findOneById(evaluationId, { relations: ["images"] });
        if (!evaluation) {
            throw new HttpException("指定id=" + evaluationId + "评价不存在0", 404);
        }
        const { name, type } = await this.storeComponent.upload(bucketName, rawName, base64, undefined);
        try {
            evaluation.images.push(this.evaluationImageRepository.create({ bucketName, name, type }));
            await this.evaluationRepository.save(evaluation);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async deleteEvaluationImage(id: number): Promise<void> {
        const evaluationImage: EvaluationImage | undefined = await this.evaluationImageRepository.findOneById(id);
        if (!evaluationImage) {
            throw new HttpException("指定id=" + id + "评价图片不存在", 404);
        }
        await this.storeComponent.delete(evaluationImage.bucketName, evaluationImage.name, evaluationImage.type);
        try {
            await this.evaluationImageRepository.remove(evaluationImage);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

}
