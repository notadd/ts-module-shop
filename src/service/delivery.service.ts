import { Component, HttpException } from "@nestjs/common";
import { Delivery } from "../model/delivery.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


/* 配送服务的组件 */
@Component()
export class DeliveryService {

    constructor(
        @InjectRepository(Delivery) private readonly deliveryRepository: Repository<Delivery>
    ) { }

    async getDeliveries(): Promise<Array<Delivery>> {
        const deliveries = await this.deliveryRepository.find();
        return deliveries;
    }

    async createDelivery(name: string, description: string, cost: number, freeLimit: number, valuationFee: number): Promise<void> {
        const exist: Delivery | undefined = await this.deliveryRepository.findOne({ name });
        if (exist) {
            throw new HttpException("指定name=" + name + "配送信息已存在", 404);
        }
        try {
            await this.deliveryRepository.save({ name, description, cost, freeLimit, valuationFee });
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }
}