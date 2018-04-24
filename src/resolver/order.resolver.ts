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

    @Mutation("createOrder")
    async createOrder(req: Request, body: {
        userId: number,
        delivertNo: string,
        delivertTime: string,
        invoiceType: string,
        invoiceContent: string,
        invoiceTitle: string,
        customerMessage: string,
        deliveryId: number,
        receivingInformationId: number
    }): Promise<Data> {
        const { userId, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, receivingInformationId } = body;
        if (!userId || !delivertNo || !delivertTime || !invoiceType || !invoiceContent || !invoiceTitle || !customerMessage || !deliveryId || !receivingInformationId) {
            throw new HttpException("缺少参数", 404);
        }
        await this.orderService.createOrder(userId, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, receivingInformationId);
        return {code: 200, message: "创建订单成功"};
    }

}