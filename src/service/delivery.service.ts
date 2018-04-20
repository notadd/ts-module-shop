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
}