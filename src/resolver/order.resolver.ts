import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { Resolver, Mutation, Query } from "@nestjs/graphql";
import { OrderService } from "../service/order.service";
import { Order } from "../model/order.entity";
import { Data } from "../interface/data";
import { Request } from "express";

/* 订单Resolver */
@Resolver("Order")
@UseInterceptors(ExceptionInterceptor)
export class OrderResolver {

    constructor(
        @Inject(OrderService) private readonly orderService: OrderService
    ) { }

}