export interface GoodsTypeData {
    code: number
    message: string
    goodsType: {
        id: number
        name: string
        properties: {
            id: number
            name: string
            type: string
            inputType: string
            list: string[]
        }[]
    }
}