/// <reference types="express" />
import { OrdersData } from "../interface/order/orders.data";
import { OrderData } from "../interface/order/order.data";
import { OrderService } from "../service/order.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class OrderResolver {
    private readonly orderService;
    constructor(orderService: OrderService);
    order(req: Request, body: {
        id: number;
    }): Promise<OrderData>;
    orders(req: Request): Promise<OrdersData>;
    createOrder(req: Request, body: {
        userId: number;
        delivertNo: string;
        delivertTime: string;
        invoiceType: string;
        invoiceContent: string;
        invoiceTitle: string;
        customerMessage: string;
        deliveryId: number;
        userReceivingInformationId: number;
        items: Array<{
            skuId: number;
            count: number;
        }>;
    }): Promise<Data>;
    createOrderFromCart(req: Request, body: {
        userId: number;
        delivertNo: string;
        delivertTime: string;
        invoiceType: string;
        invoiceContent: string;
        invoiceTitle: string;
        customerMessage: string;
        deliveryId: number;
        userReceivingInformationId: number;
        itemIds: Array<number>;
    }): Promise<Data>;
    updateOrder(req: Request, body: {
        id: number;
        delivertNo: string;
        delivertTime: string;
        invoiceType: string;
        invoiceContent: string;
        invoiceTitle: string;
        customerMessage: string;
        deliveryId: number;
        userReceivingInformationId: number;
    }): Promise<Data>;
    deleteOrder(req: Request, body: {
        id: number;
    }): Promise<Data>;
}
