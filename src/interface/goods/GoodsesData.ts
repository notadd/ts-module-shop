export interface GoodsesData{
    code:number
    message:string
    goodses:{
        id:number
        name:string
        basePrice:number
        description:string
    }[]
}