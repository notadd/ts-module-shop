import { InputEvaluationImage } from "../interface/evaluation/input.evaluation.image";
import { UserComponent, UserComponentToken, User } from "@notadd/user";
import { EvaluationImage } from "../model/evaluation.image.entity";
import { Component, HttpException, Inject } from "@nestjs/common";
import { StoreComponent } from "../interface/store.component";
import { Evaluation } from "../model/evaluation.entity";
import { OrderItem } from "../model/order.item.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Goods } from "../model/goods.entity";
import { Repository } from "typeorm";

/* 评价的服务组件 */
@Component()
export class EvaluationService {

    constructor(
        @Inject(UserComponentToken) private readonly userComponent: UserComponent,
        @InjectRepository(Goods) private readonly goodsRepository: Repository<Goods>,
        @Inject("StoreComponentToken") private readonly storeComponent: StoreComponent,
        @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Evaluation) private readonly evaluationRepository: Repository<Evaluation>,
        @InjectRepository(EvaluationImage) private readonly evaluationImageRepository: Repository<EvaluationImage>
    ) { }

    async getEvaluation(id: number): Promise<Evaluation> {
        const evaluation: Evaluation | undefined = await this.evaluationRepository.createQueryBuilder("evaluation")
            .leftJoinAndSelect("evaluation.orderItem", "orderItem")
            .where({ id })
            .getOne();
        if (!evaluation) {
            throw new HttpException("指定id=" + id + "评价不存在", 404);
        }
        return evaluation;
    }

    async getEvaluations(goodsId: number): Promise<Array<Evaluation>> {
        /* 这里的查询暂时不确定是否准确 */
        const goods: Goods | undefined = await this.goodsRepository.createQueryBuilder("goods")
            .loadRelationIdAndMap("skuIds", "goods.skus")
            .where({ id: goodsId })
            .getOne();
        const orderItems: Array<OrderItem> | undefined = await this.orderItemRepository.createQueryBuilder("orderItem")
            .where(`orderItem.skuId in (${(goods as any).skuIds.join(",")})`)
            .innerJoinAndSelect("orderItem.evaluation", "evaluation")
            .getMany();
        const evaluations: Array<Evaluation> | undefined = orderItems.map(orderItem => {
            orderItem.evaluation.orderItem = orderItem;
            return orderItem.evaluation;
        });
        return evaluations;
    }

    async createEvaluation(content: string, userId: number, orderItemId: number, inputImages: Array<InputEvaluationImage>): Promise<void> {
        const user: User | undefined = await this.userComponent.getUserById(userId);
        if (!user) {
            throw new HttpException("指定id=" + userId + "用户不存在", 404);
        }
        const orderItem: OrderItem | undefined = await this.orderItemRepository.findOneById(orderItemId);
        if (!orderItem) {
            throw new HttpException("指定id=" + orderItemId + "订单项不存在", 404);
        }
        /*
        一个订单项只有所属用户可以评价，且一个订单项只能评价一次
        按理说，一个订单只有当交易成功后才可以评价，但是目前订单状态还没有定义
        */
        if (orderItem.userId !== userId) {
            throw new HttpException("指定id=" + orderItemId + "订单项不属于当前用户，不能评价", 404);
        }
        if (orderItem.evaluation) {
            throw new HttpException("指定id=" + orderItemId + "订单项已经评价，不能再次评价", 404);
        }
        const images: Array<EvaluationImage> = new Array();
        for (let i = 0; i < inputImages.length; i++) {
            const { bucketName, name, type } = await this.storeComponent.upload(inputImages[i].bucketName, inputImages[i].rawName, inputImages[i].base64, undefined);
            images.push(this.evaluationImageRepository.create({ bucketName, name, type }));
        }
        try {
            await this.evaluationRepository.save({ content, display: true, user, orderItem, images });
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async updateEvaluation(id: number, content: string, display: string): Promise<void> {
        const evaluation: Evaluation | undefined = await this.evaluationRepository.findOneById(id);
        if (!evaluation) {
            throw new HttpException("指定id=" + id + "评价不存在", 404);
        }
        try {
            evaluation.content = content;
            evaluation.display = display==="true";
            await this.evaluationRepository.save(evaluation);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async deleteEvaluation(id: number): Promise<void> {
        const evaluation: Evaluation | undefined = await this.evaluationRepository.findOneById(id, { relations: ["images"] });
        if (!evaluation) {
            throw new HttpException("指定id=" + id + "评价不存在", 404);
        }
        for (let i = 0; i < evaluation.images.length; i++) {
            const { bucketName, name, type }: EvaluationImage = evaluation.images[i];
            await this.storeComponent.delete(bucketName, name, type);
        }
        try {
            /* 删除评价时会级联删除EvaluationImage实体 */
            await this.evaluationRepository.remove(evaluation);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }
}
