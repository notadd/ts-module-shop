import { Repository, Connection, QueryRunner, SelectQueryBuilder } from "typeorm";
import { Component, HttpException, Inject } from "@nestjs/common";
import { UserComponent, UserComponentToken } from "@notadd/user";
import { OrderItem } from "../model/order.item.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Sku } from "../model/sku.entity";

/* 订单项服务组件 */
@Component()
export class OrderItemService {

    constructor(
        @InjectRepository(Sku) private readonly skuRepository: Repository<Sku>,
        @Inject(UserComponentToken) private readonly userComponent: UserComponent,
        @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    ) { }

    /* 获取指定用户购物车订单项，即过滤出order属性不存在的订单项 */
    async findCartItems(userId: number): Promise<Array<OrderItem>> {
        const cartItems: Array<OrderItem> | undefined = await this.orderItemRepository.createQueryBuilder("item")
            .where({ userId })
            .leftJoinAndSelect("item.sku", "sku")
            .leftJoinAndSelect("item.order", "order")
            .getMany();
        return cartItems.filter(item => !item.order);
    }

    async findOrderItem(id: number): Promise<OrderItem> {
        const orderItem: OrderItem | undefined = await this.orderItemRepository.createQueryBuilder("item")
            .where({ id })
            .leftJoinAndSelect("item.sku", "sku")
            .leftJoinAndSelect("item.order", "order")
            .getOne();
        return orderItem;
    }

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
            await this.orderItemRepository.save({ count, userId, sku });
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async updateOrderItem(id: number, count: number): Promise<void> {
        const item: OrderItem | undefined = await this.orderItemRepository.findOneById(id);
        if (!item) {
            throw new HttpException("指定id=" + id + "订单项不存在", 404);
        }
        item.count = count;
        try {
            await this.orderItemRepository.save(item);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async deleteOrderItem(id: number): Promise<void> {
        const item: OrderItem | undefined = await this.orderItemRepository.findOneById(id);
        if (!item) {
            throw new HttpException("指定id=" + id + "订单项不存在", 404);
        }
        try {
            await this.orderItemRepository.remove(item);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }
}
