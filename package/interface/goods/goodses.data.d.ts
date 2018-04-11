export interface GoodsesData {
    code: number;
    message: string;
    goodses: Array<{
        id: number;
        name: string;
        basePrice: number;
        description: string;
    }>;
}
