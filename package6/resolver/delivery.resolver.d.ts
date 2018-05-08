/// <reference types="express" />
import { DeliveriesData } from "../interface/delivery/deliveries.data";
import { DeliveryService } from "../service/delivery.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class DeliveryResolver {
    private readonly deliveryService;
    constructor(deliveryService: DeliveryService);
    deliveries(req: Request): Promise<DeliveriesData>;
    createDelivery(req: Request, body: {
        name: string;
        description: string;
        cost: number;
        freeLimit: number;
        valuationFee: number;
    }): Promise<Data>;
    updateDelivery(req: Request, body: {
        id: number;
        name: string;
        description: string;
        cost: number;
        freeLimit: number;
        valuationFee: number;
    }): Promise<Data>;
    deleteDelivery(req: Request, body: {
        id: number;
    }): Promise<Data>;
}
