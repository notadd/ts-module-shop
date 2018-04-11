export interface GoodsTypesData {
    code: number;
    message: string;
    goodsTypes: Array<{
        id: number
        name: string
    }>;
}