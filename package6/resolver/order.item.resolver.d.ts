/// <reference types="express" />
import { CartItemsData } from "../interface/orderitem/cart.items.data";
import { OrderItemData } from "../interface/orderitem/order.item.data";
import { OrderItemService } from "../service/order.item.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class OrderItemResolver {
    private readonly orderItemService;
    constructor(orderItemService: OrderItemService);
    cartItems(req: Request, body: {
        userId: number;
    }): Promise<CartItemsData>;
    orderItem(req: Request, body: {
        id: number;
    }): Promise<OrderItemData>;
    createOrderItem(req: Request, body: {
        count: number;
        skuId: number;
        userId: number;
    }): Promise<Data>;
    updateOrderItem(req: Request, body: {
        id: number;
        count: number;
    }): Promise<Data>;
    deleteOrderItem(req: Request, body: {
        id: number;
    }): Promise<Data>;
}
