import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { DeliveriesData } from "../interface/delivery/deliveries.data";
import { DeliveryService } from "../service/delivery.service";
import { Resolver, Query, Mutation } from "@nestjs/graphql";
import { Data } from "../interface/data";
import { Request } from "express";


/* 配送方式Resolver */
@Resolver("Delivery")
@UseInterceptors(ExceptionInterceptor)
export class DeliveryResolver {

    constructor(
        @Inject(DeliveryService) private readonly deliveryService: DeliveryService
    ) { }

    @Query("deliveries")
    async deliveries(req: Request): Promise<DeliveriesData> {
        const deliveries = await this.deliveryService.getDeliveries();
        return { code: 200, message: "获取所有配送服务成功", deliveries };
    }

    @Mutation("createDelivery")
    async createDelivery(req: Request, body: { name: string, description: string, cost: number, freeLimit: number, valuationFee: number }): Promise<Data> {
        const { name, description, cost, freeLimit, valuationFee} = body;
        if (!name || !description || cost === undefined || cost === null || freeLimit === undefined || freeLimit === null || valuationFee === undefined || valuationFee === null) {
            throw new HttpException("缺少参数", 404);
        }
        await this.deliveryService.createDelivery(name, description, cost, freeLimit, valuationFee);
        return {code: 200, message: "创建配送信息成功"};
    }

}