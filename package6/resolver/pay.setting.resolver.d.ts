/// <reference types="express" />
import { PaySettingData } from "../interface/paysetting/pay.setting.data";
import { PaySettingService } from "../service/pay.setting.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class PaySettingResolver {
    private readonly paySettingService;
    constructor(paySettingService: PaySettingService);
    paySetting(): Promise<PaySettingData>;
    savePaySetting(req: Request, body: {
        aliPay: string;
        weixinPay: string;
    }): Promise<Data>;
    clearPaySetting(req: Request): Promise<Data>;
}
