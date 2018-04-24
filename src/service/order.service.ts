import { Repository, Connection, QueryRunner, SelectQueryBuilder } from "typeorm";
import { Component, HttpException, Inject } from "@nestjs/common";
import { UserComponent } from "../interface/user.component";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "../model/order.entity";

/* 订单服务组件 */
@Component()
export class OrderService {

    constructor(
        @Inject("UserComponentToken") private readonly userComponent: UserComponent,
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>
    ) { }

}
