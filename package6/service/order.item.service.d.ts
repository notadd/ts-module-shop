import { Repository } from "typeorm";
import { UserComponent } from "../interface/user.component";
import { OrderItem } from "../model/order.item.entity";
import { Sku } from "../model/sku.entity";
export declare class OrderItemService {
    private readonly skuRepository;
    private readonly userComponent;
    private readonly orderItemRepository;
    constructor(skuRepository: Repository<Sku>, userComponent: UserComponent, orderItemRepository: Repository<OrderItem>);
    findCartItems(userId: number): Promise<Array<OrderItem>>;
    findOrderItem(id: number): Promise<OrderItem>;
    createOrderItem(count: number, skuId: number, userId: number): Promise<void>;
    updateOrderItem(id: number, count: number): Promise<void>;
    deleteOrderItem(id: number): Promise<void>;
}
