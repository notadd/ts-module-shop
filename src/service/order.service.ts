import { UserReceivingInformation } from "../model/user.receiving.information.entity";
import { Repository, Connection, QueryRunner, SelectQueryBuilder } from "typeorm";
import { Component, HttpException, Inject } from "@nestjs/common";
import { UserComponent, UserComponentToken } from "@notadd/user";
import { OrderItem } from "../model/order.item.entity";
import { Delivery } from "../model/delivery.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { RandomUtil } from "../util/random.util";
import { Order } from "../model/order.entity";
import { DateUtil } from "../util/date.util";
import { Sku } from "../model/sku.entity";

/* 订单服务组件 */
@Component()
export class OrderService {

    constructor(
        @Inject(DateUtil) private readonly dateUtil: DateUtil,
        @Inject(Connection) private readonly connection: Connection,
        @Inject(RandomUtil) private readonly randomUtil: RandomUtil,
        @InjectRepository(Sku) private readonly skuRepository: Repository<Sku>,
        @Inject(UserComponentToken) private readonly userComponent: UserComponent,
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Delivery) private readonly deliveryRepository: Repository<Delivery>,
        @InjectRepository(UserReceivingInformation) private readonly userReceivingInformationRepository: Repository<UserReceivingInformation>
    ) { }

    async getOrders(): Promise<Array<Order>> {
        const orders: Array<Order> | undefined = await this.orderRepository.createQueryBuilder("order")
            .leftJoinAndSelect("order.items", "item")
            .leftJoinAndSelect("order.delivery", "delivery")
            .leftJoinAndSelect("order.userReceivingInformation", "userReceivingInformation")
            .getMany();
        return orders;
    }

    async getOrder(id: number): Promise<Order> {
        const order: Order | undefined = await this.orderRepository.createQueryBuilder("order")
            .leftJoinAndSelect("order.items", "item")
            .leftJoinAndSelect("order.delivery", "delivery")
            .leftJoinAndSelect("order.userReceivingInformation", "userReceivingInformation")
            .getOne();
        if (!order) {
            throw new HttpException("指定id=" + id + "订单不存在", 404);
        }
        return order;
    }

    async createOrder(
        userId: number,
        delivertNo: string,
        delivertTime: string,
        invoiceType: string,
        invoiceContent: string,
        invoiceTitle: string,
        customerMessage: string,
        deliveryId: number,
        userReceivingInformationId: number,
        items: Array<{ skuId: number, count: number }>
    ): Promise<void> {
        const user: { id: number, userName: string, status: boolean, recycle: boolean } | undefined = await this.userComponent.getUserById(userId);
        if (!user) {
            throw new HttpException("指定id=" + userId + "用户不存在", 404);
        }
        const delivery: Delivery | undefined = await this.deliveryRepository.findOneById(deliveryId);
        if (!delivery) {
            throw new HttpException("指定id=" + deliveryId + "配送信息不存在", 404);
        }
        const userReceivingInformation: UserReceivingInformation | undefined = await this.userReceivingInformationRepository.findOneById(userReceivingInformationId);
        if (!userReceivingInformation) {
            throw new HttpException("缺少参数", 404);
        }
        /* 生成32位订单号  */
        const orderNo = this.dateUtil.getString(new Date()) + this.randomUtil.getRandom(18);
        const orderItems: Array<OrderItem> = new Array();
        for (let i = 0; i < items.length; i++) {
            const sku: Sku | undefined = await this.skuRepository.findOneById(items[i].skuId);
            if (!sku) {
                throw new HttpException("指定id=" + items[i].skuId + "Sku不存在", 404);
            }
            if (sku.inventory < items[i].count) {
                throw new HttpException("商品库存小于购买数量", 404);
            }
            orderItems[i] = this.orderItemRepository.create({ count: items[i].count, userId, sku, });
        }
        const queryRunner: QueryRunner = this.connection.createQueryRunner("master");
        await queryRunner.startTransaction();
        try {
            for (let i = 0; i < items.length; i++) {
                await queryRunner.manager.save(orderItems[i]);
                /* 更新库存 */
                orderItems[i].sku.inventory -= items[i].count;
                await queryRunner.manager.save(orderItems[i].sku);
            }
            await queryRunner.manager.save(
                this.orderRepository.create({ orderNo, userId, delivertNo, delivertTime: new Date(delivertTime), invoiceType, invoiceContent, invoiceTitle, customerMessage, delivery, userReceivingInformation, orderItems })
            );
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.log(err);
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        } finally {
            await queryRunner.release();
        }
    }

    async createOrderFromCart(
        userId: number,
        delivertNo: string,
        delivertTime: string,
        invoiceType: string,
        invoiceContent: string,
        invoiceTitle: string,
        customerMessage: string,
        deliveryId: number,
        userReceivingInformationId: number,
        itemIds: Array<number>
    ): Promise<void> {
        const user: { id: number, userName: string, status: boolean, recycle: boolean } | undefined = await this.userComponent.getUserById(userId);
        if (!user) {
            throw new HttpException("指定id=" + userId + "用户不存在", 404);
        }
        const delivery: Delivery | undefined = await this.deliveryRepository.findOneById(deliveryId);
        if (!delivery) {
            throw new HttpException("指定id=" + deliveryId + "配送信息不存在", 404);
        }
        const userReceivingInformation: UserReceivingInformation | undefined = await this.userReceivingInformationRepository.findOneById(userReceivingInformationId);
        if (!userReceivingInformation) {
            throw new HttpException("缺少参数", 404);
        }
        /* 生成32位订单号  */
        const orderNo = this.dateUtil.getString(new Date()) + this.randomUtil.getRandom(18);
        const items: Array<OrderItem> | undefined = await this.orderItemRepository.findByIds(itemIds, { relations: ["order"] });
        itemIds.forEach(id => {
            const item: OrderItem | undefined = items.find(i => i.id === id);
            if (!item) {
                throw new HttpException("指定id=" + id + "订单项不存在", 404);
            }
            if (item.userId !== userId) {
                throw new HttpException("指定订单项不属于指定id=" + userId + "用户", 404);
            }
            if (item.order) {
                throw new HttpException("指定订单项id=" + id + "已属于订单", 404);
            }
        });
        const queryRunner: QueryRunner = this.connection.createQueryRunner("master");
        await queryRunner.startTransaction();
        try {
            for (let i = 0; i < items.length; i++) {
                items[i].sku.inventory -= items[i].count;
                await queryRunner.manager.save(items[i].sku);
            }
            await queryRunner.manager.save({ orderNo, userId, delivertNo, delivertTime: new Date(delivertTime), invoiceType, invoiceContent, invoiceTitle, customerMessage, delivery, userReceivingInformation, items });
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        } finally {
            await queryRunner.release();
        }
    }

    async updateOrder(
        id: number,
        delivertNo: string,
        delivertTime: string,
        invoiceType: string,
        invoiceContent: string,
        invoiceTitle: string,
        customerMessage: string,
        deliveryId: number,
        userReceivingInformationId: number
    ): Promise<void> {
        const order: Order | undefined = await this.orderRepository.findOneById(id);
        if (!order) {
            throw new HttpException("指定id=" + id + "订单不存在", 404);
        }
        const delivery: Delivery | undefined = await this.deliveryRepository.findOneById(deliveryId);
        if (!delivery) {
            throw new HttpException("指定id=" + deliveryId + "配送信息不存在", 404);
        }
        const userReceivingInformation: UserReceivingInformation | undefined = await this.userReceivingInformationRepository.findOneById(userReceivingInformationId);
        if (!userReceivingInformation) {
            throw new HttpException("缺少参数", 404);
        }
        order.delivertNo = delivertNo;
        order.delivertTime = new Date(delivertTime);
        order.invoiceType = invoiceType;
        order.invoiceContent = invoiceContent;
        order.invoiceTitle = invoiceTitle;
        order.customerMessage = customerMessage;
        order.delivery = delivery;
        order.userReceivingInformation = userReceivingInformation;
        try {
            await this.orderRepository.save(order);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async deleteOrder(id: number): Promise<void> {
        const order: Order | undefined = await this.orderRepository.findOneById(id);
        if (!order) {
            throw new HttpException("指定id=" + id + "订单不存在", 404);
        }
        try {
            await this.orderRepository.remove(order);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }
}
