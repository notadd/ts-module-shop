import { Delivery } from "../model/delivery.entity";
import { Repository } from "typeorm";
export declare class DeliveryService {
    private readonly deliveryRepository;
    constructor(deliveryRepository: Repository<Delivery>);
    getDeliveries(): Promise<Array<Delivery>>;
    createDelivery(name: string, description: string, cost: number, freeLimit: number, valuationFee: number): Promise<void>;
    updateDelivery(id: number, name: string, description: string, cost: number, freeLimit: number, valuationFee: number): Promise<void>;
    deleteDelivery(id: number): Promise<void>;
}
