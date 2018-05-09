import { UserComponent, UserComponentToken, User } from "@notadd/user";
import { Component, HttpException, Inject } from "@nestjs/common";
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
        @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Evaluation) private readonly evaluationRepository: Repository<Evaluation>
    ) { }

    async getEvaluation(id: number): Promise<Evaluation> {
        const evaluation: Evaluation | undefined = await this.evaluationRepository.createQueryBuilder("evaluation")
            .leftJoinAndSelect("evaluation.orderItem", "orderItem")
            .where({ id })
            .getOne();
        return evaluation;
    }

    async getEvaluations(goodsId: number): Promise<Array<Evaluation>> {
        const goods: Goods | undefined = await this.goodsRepository.createQueryBuilder("goods")
            .loadRelationIdAndMap("skuIds", "goods.skus")
            .where({ id: goodsId })
            .getOne();
        const orderItems: Array<OrderItem> | undefined = await this.orderItemRepository.createQueryBuilder("orderItem")
            .where(`orderItem.skuId in (${(goods as any).skuIds.join(",")})`)
            .innerJoinAndSelect("orderItem.evaluation", "evaluation")
            .getMany();
        const evaluations: Array<Evaluation> | undefined = orderItems.map(orderItem => orderItem.evaluation);
        return evaluations;
    }

    async createEvaluation(content: string, userId: number, orderItemId: number): Promise<void> {
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
        try {
            await this.evaluationRepository.save({ content, display: true, user, orderItem });
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async updateEvaluation(id: number, content: string): Promise<void> {
        const evaluation: Evaluation | undefined = await this.evaluationRepository.findOneById(id);
        if (!evaluation) {
            throw new HttpException("指定id=" + id + "评价不存在", 404);
        }
        try {
            evaluation.content = content;
            await this.evaluationRepository.save(evaluation);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async deleteEvaluation(id: number): Promise<void> {
        const evaluation: Evaluation | undefined = await this.evaluationRepository.findOneById(id);
        if (!evaluation) {
            throw new HttpException("指定id=" + id + "评价不存在", 404);
        }
        try {
            await this.evaluationRepository.remove(evaluation);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }
}
