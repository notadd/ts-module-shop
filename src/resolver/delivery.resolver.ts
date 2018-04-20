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
        return {code: 200, message: "获取所有配送服务成功", deliveries};
    }

}