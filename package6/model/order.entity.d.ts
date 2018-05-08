import { UserReceivingInformation } from "./user.receiving.information.entity";
import { OrderItem } from "./order.item.entity";
import { Delivery } from "./delivery.entity";
export declare class Order {
    id: number;
    orderNo: string;
    createDate: Date;
    updateDate: Date;
    userId: number;
    delivertNo: string;
    delivertTime: Date;
    invoiceType: string;
    invoiceContent: string;
    invoiceTitle: string;
    customerMessage: string;
    deliveryId: number;
    receivingInformationId: number;
    delivery: Delivery;
    items: Array<OrderItem>;
    userReceivingInformation: UserReceivingInformation;
}
