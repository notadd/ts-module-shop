import { Repository, Connection, QueryRunner, SelectQueryBuilder } from "typeorm";
import { Component, HttpException, Inject } from "@nestjs/common";
import { UserComponent } from "../interface/user.component";
import { OrderItem } from "../model/order.item.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Sku } from "../model/sku.entity";


/* 订单项服务组件 */
@Component()
export class OrderItemService {

    constructor(
        @InjectRepository(Sku) private readonly skuRepository: Repository<Sku>,
        @Inject("UserComponentToken") private readonly userComponent: UserComponent,
        @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    ) { }

    async createOrderItem(count: number, skuId: number, userId: number): Promise<void> {
        const user: { id: number, userName: string, status: boolean, recycle: boolean } = await this.userComponent.getUserById(userId);
        if (!user) {
            throw new HttpException("指定id=" + userId + "用户不存在", 404);
        }
        const sku: Sku | undefined = await this.skuRepository.findOneById(skuId);
        if (!sku) {
            throw new HttpException("指定id=" + skuId + "Sku不存在", 404);
        }
        try {
            await this.orderItemRepository.save({count, userId, sku});
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }
}