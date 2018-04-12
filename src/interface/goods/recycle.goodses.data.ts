export interface RecycleGoodsesData {
    code: number;
    message: string;
    recycleGoodses: Array<{
        id: number
        name: string
        basePrice: number
        description: string
    }>;
}