export interface RecycleGoodsesData {
    code: number;
    message: string;
    recycleGoodses: Array<{
        id: number
        name: string
        basePrice: number
        discountPrice: number
        description: string
    }>;
}