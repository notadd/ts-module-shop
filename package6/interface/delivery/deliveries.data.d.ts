export interface DeliveriesData {
    code: number;
    message: string;
    deliveries: Array<{
        id: number;
        name: string;
        description: string;
        cost: number;
        freeLimit: number;
        valuationFee: number;
    }>;
}
