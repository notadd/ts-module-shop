export interface GoodsesData {
    code: number;
    message: string;
    goodses: Array<{
        id: number
        name: string
        basePrice: number
        discountPrice: number
        description: string
    }>;
}