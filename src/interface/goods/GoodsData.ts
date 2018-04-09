import { GoodsProperty } from '../goodsproperty/GoodsProperty';

export interface GoodsData {
    code: number
    message: string
    goods: {
        id: number
        name: string
        basePrice: number
        description: string
        type: {
            id: number
            name: string
            properties: GoodsProperty[]
        },
        values: {
            id: number
            value: string
            price: number
            property: GoodsProperty
        }[]
    }
}