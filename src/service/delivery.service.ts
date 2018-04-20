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

    async updateDelivery(id: number, name: string, description: string, cost: number, freeLimit: number, valuationFee: number): Promise<void> {
        const delivery: Delivery | undefined = await this.deliveryRepository.findOneById(id);
        if (!delivery) {
            throw new HttpException("指定id=" + id + "配送信息不存在", 404);
        }
        if (name && name !== delivery.name) {
            const exist: Delivery | undefined = await this.deliveryRepository.findOne({ name });
            if (exist) {
                throw new HttpException("指定name=" + name + "配送信息已存在", 404);
            }
            delivery.name = name;
        }
        if (description) {
            delivery.description = description;
        }
        if (cost !== undefined && cost !== null) {
            delivery.cost = cost;
        }
        if (freeLimit !== undefined && freeLimit !== null) {
            delivery.freeLimit = freeLimit;
        }
        if (valuationFee !== undefined && valuationFee !== null) {
            delivery.valuationFee = valuationFee;
        }
        try {
            await this.deliveryRepository.save(delivery);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }
    async deleteDelivery(id: number): Promise<void> {
        const delivery: Delivery|undefined = await this.deliveryRepository.findOneById(id);
        if (!delivery) {
            throw new HttpException("指定id=" + id + "配送信息不存在", 404);
        }
        try {
            await this.deliveryRepository.remove(delivery);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }
}