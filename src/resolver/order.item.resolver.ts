import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { OrderItemService } from "../service/order.item.service";
import { Resolver, Mutation, Query } from "@nestjs/graphql";
import { Order } from "../model/order.entity";
import { Data } from "../interface/data";
import { Request } from "express";

/* 订单项Resolver */
@Resolver("OrderItem")
@UseInterceptors(ExceptionInterceptor)
export class OrderItemResolver {

    constructor(
        @Inject(OrderItemService) private readonly orderItemService: OrderItemService
    ) { }

}
