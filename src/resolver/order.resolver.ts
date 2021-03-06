import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { OrdersData } from "../interface/order/orders.data";
import { Resolver, Mutation, Query } from "@nestjs/graphql";
import { OrderData } from "../interface/order/order.data";
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

    @Query("order")
    async order(req: Request, body: { id: number }): Promise<OrderData> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 404);
        }
        const order = await this.orderService.getOrder(id);
        return { code: 200, message: "获取指定订单成功", order };
    }

    @Query("orders")
    async orders(req: Request): Promise<OrdersData> {
        const orders = await this.orderService.getOrders();
        return { code: 200, message: "获取所有订单成功", orders };
    }

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
        userReceivingInformationId: number,
        items: Array<{ skuId: number, count: number }>
    }): Promise<Data> {
        const { userId, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, userReceivingInformationId, items } = body;
        if (!userId || !delivertNo || !delivertTime || !invoiceType || !invoiceContent || !invoiceTitle || !customerMessage || !deliveryId || !userReceivingInformationId || !items || items.length === 0) {
            throw new HttpException("缺少参数", 404);
        }
        await this.orderService.createOrder(userId, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, userReceivingInformationId, items);
        return { code: 200, message: "创建订单成功" };
    }

    @Mutation("createOrderFromCart")
    async createOrderFromCart(req: Request, body: {
        userId: number,
        delivertNo: string,
        delivertTime: string,
        invoiceType: string,
        invoiceContent: string,
        invoiceTitle: string,
        customerMessage: string,
        deliveryId: number,
        userReceivingInformationId: number,
        itemIds: Array<number>
    }): Promise<Data> {
        const { userId, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, userReceivingInformationId, itemIds } = body;
        if (!userId || !delivertNo || !delivertTime || !invoiceType || !invoiceContent || !invoiceTitle || !customerMessage || !deliveryId || !userReceivingInformationId || !itemIds || itemIds.length === 0) {
            throw new HttpException("缺少参数", 404);
        }
        await this.orderService.createOrderFromCart(userId, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, userReceivingInformationId, itemIds);
        return { code: 200, message: "从购物车创建订单成功" };
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

    @Mutation("deleteOrder")
    async deleteOrder(req: Request, body: {
        id: number
    }): Promise<Data> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 404);
        }
        await this.orderService.deleteOrder(id);
        return { code: 200, message: "删除订单成功" };
    }
}
