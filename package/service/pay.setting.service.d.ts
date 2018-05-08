import { PaySetting } from "../model/pay.setting.entity";
import { Repository } from "typeorm";
export declare class PaySettingService {
    private readonly paySettingRepository;
    constructor(paySettingRepository: Repository<PaySetting>);
    getPaySetting(): Promise<PaySetting>;
    savePaySetting(aliPay: string, weixinPay: string): Promise<void>;
    clearPaySetting(): Promise<void>;
}
