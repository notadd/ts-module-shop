import { Repository, Connection, QueryRunner, SelectQueryBuilder } from "typeorm";
import { Component, HttpException, Inject } from "@nestjs/common";
import { OrderItem } from "../model/order.item.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Sku } from "../model/sku.entity";
/* 订单项服务组件 */
@Component()
export class OrderItemService {

    constructor(
        @InjectRepository(Sku) private readonly skuRepository: Repository<sKU>,
        @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    ) { }

}