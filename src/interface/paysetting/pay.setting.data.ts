export interface PaySettingData{
    code:number
    message:string
    paySetting:{
        id: number
        aliPay: boolean
        weixinPay: boolean
    };
}