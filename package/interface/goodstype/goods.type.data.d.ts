export interface GoodsTypeData {
    code: number;
    message: string;
    goodsType: {
        id: number;
        name: string;
        properties: Array<{
            id: number;
            name: string;
            type: string;
            inputType: string;
            list: Array<string>;
        }>;
    };
}
