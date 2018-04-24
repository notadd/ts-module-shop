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
        userReceivingInformationId: number
    }): Promise<Data> {
        const { userId, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, userReceivingInformationId } = body;
        if (!userId || !delivertNo || !delivertTime || !invoiceType || !invoiceContent || !invoiceTitle || !customerMessage || !deliveryId || !userReceivingInformationId) {
            throw new HttpException("缺少参数", 404);
        }
        await this.orderService.createOrder(userId, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, userReceivingInformationId);
        return { code: 200, message: "创建订单成功" };
    }

    @Mutation("updateOrder")
    async updateOrder(req: Request, body: {
        id: number,
        delivertNo: string,
        delivertTime: string,
        invoiceType: string,
        invoiceContent: string,
        invoiceTitle: string,
        customerMessage: string,
        deliveryId: number,
        userReceivingInformationId: number
    }): Promise<Data> {
        const { id, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, userReceivingInformationId } = body;
        if (!id || !delivertNo || !delivertTime || !invoiceType || !invoiceContent || !invoiceTitle || !customerMessage || !deliveryId || !userReceivingInformationId) {
            throw new HttpException("缺少参数", 404);
        }
        await this.orderService.updateOrder(id, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, userReceivingInformationId);
        return { code: 200, message: "更新订单成功" };
    }

}