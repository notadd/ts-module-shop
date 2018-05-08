import { UserReceivingInformation } from "../model/user.receiving.information.entity";
import { Repository, Connection } from "typeorm";
import { UserComponent } from "../interface/user.component";
import { OrderItem } from "../model/order.item.entity";
import { Delivery } from "../model/delivery.entity";
import { RandomUtil } from "../util/random.util";
import { Order } from "../model/order.entity";
import { DateUtil } from "../util/date.util";
import { Sku } from "../model/sku.entity";
export declare class OrderService {
    private readonly dateUtil;
    private readonly connection;
    private readonly randomUtil;
    private readonly skuRepository;
    private readonly userComponent;
    private readonly orderRepository;
    private readonly orderItemRepository;
    private readonly deliveryRepository;
    private readonly userReceivingInformationRepository;
    constructor(dateUtil: DateUtil, connection: Connection, randomUtil: RandomUtil, skuRepository: Repository<Sku>, userComponent: UserComponent, orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, deliveryRepository: Repository<Delivery>, userReceivingInformationRepository: Repository<UserReceivingInformation>);
    getOrders(): Promise<Array<Order>>;
    getOrder(id: number): Promise<Order>;
    createOrder(userId: number, delivertNo: string, delivertTime: string, invoiceType: string, invoiceContent: string, invoiceTitle: string, customerMessage: string, deliveryId: number, userReceivingInformationId: number, items: Array<{
        skuId: number;
        count: number;
    }>): Promise<void>;
    createOrderFromCart(userId: number, delivertNo: string, delivertTime: string, invoiceType: string, invoiceContent: string, invoiceTitle: string, customerMessage: string, deliveryId: number, userReceivingInformationId: number, itemIds: Array<number>): Promise<void>;
    updateOrder(id: number, delivertNo: string, delivertTime: string, invoiceType: string, invoiceContent: string, invoiceTitle: string, customerMessage: string, deliveryId: number, userReceivingInformationId: number): Promise<void>;
    deleteOrder(id: number): Promise<void>;
}
