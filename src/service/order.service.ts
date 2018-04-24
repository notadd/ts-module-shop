import { UserReceivingInformation } from "../model/user.receiving.information.entity";
import { Repository, Connection, QueryRunner, SelectQueryBuilder } from "typeorm";
import { Component, HttpException, Inject } from "@nestjs/common";
import { UserComponent } from "../interface/user.component";
import { Delivery } from "../model/delivery.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { RandomUtil } from "../util/random.util";
import { Order } from "../model/order.entity";
import { DateUtil } from "../util/date.util";


/* 订单服务组件 */
@Component()
export class OrderService {

    constructor(
        @Inject(DateUtil) private readonly dateUtil: DateUtil,
        @Inject(RandomUtil) private readonly randomUtil: RandomUtil,
        @Inject("UserComponentToken") private readonly userComponent: UserComponent,
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
        @InjectRepository(Delivery) private readonly deliveryRepository: Repository<Delivery>,
        @InjectRepository(UserReceivingInformation) private readonly userReceivingInformationRepository: Repository<UserReceivingInformation>
    ) { }

    async createOrder(
        userId: number,
        delivertNo: string,
        delivertTime: string,
        invoiceType: string,
        invoiceContent: string,
        invoiceTitle: string,
        customerMessage: string,
        deliveryId: number,
        userReceivingInformationId: number
    ): Promise<void> {
        const user: { id: number, userName: string, status: boolean, recycle: boolean } = await this.userComponent.getUserById(userId);
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
        try {
            await this.orderRepository.save({ orderNo, userId, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, delivery, userReceivingInformation });
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

}
