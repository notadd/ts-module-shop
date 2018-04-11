import { GoodsProperty } from "../goodsproperty/goods.property";
export interface GoodsData {
    code: number;
    message: string;
    goods: {
        id: number;
        name: string;
        basePrice: number;
        description: string;
        type: {
            id: number;
            name: string;
            properties: Array<GoodsProperty>;
        };
        values: Array<{
            id: number;
            value: string;
            price: number;
            property: GoodsProperty;
        }>;
    };
}
