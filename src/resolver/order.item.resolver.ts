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

    @Mutation("createOrderItem")
    async createOrderItem(req: Request, body: { count: number, skuId: number, userId: number }): Promise<Data> {
        const { count, skuId, userId } = body;
        if (!count || !skuId || !userId) {
            throw new HttpException("缺少参数", 400);
        }
        if (count <= 0) {
            throw new HttpException("商品数量必须大于0", 400);
        }
        await this.orderItemService.createOrderItem(count, skuId, userId);
        return { code: 200, message: "创建订单项成功" };
    }

    @Mutation("updateOrderItem")
    async updateOrderItem(req: Request, body: { id: number, count: number }): Promise<Data> {
        const { id, count } = body;
        if (!id || !count) {
            throw new HttpException("缺少参数", 400);
        }
        if (count <= 0) {
            throw new HttpException("商品数量必须大于0", 400);
        }
        await this.orderItemService.updateOrderItem(id, count);
        return { code: 200, message: "更新订单项成功" };
    }
}