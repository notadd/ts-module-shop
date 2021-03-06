import { Injectable, HttpException, Inject } from "@nestjs/common";
import { PaySetting } from "../model/pay.setting.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

/* 支付配置服务组件 */
@Injectable()
export class PaySettingService {

    constructor(
        @InjectRepository(PaySetting) private readonly paySettingRepository: Repository<PaySetting>
    ) { }

    async getPaySetting(): Promise<PaySetting> {
        const paySetting: PaySetting | undefined = await this.paySettingRepository.findOne(1);
        if (!paySetting) {
            throw new HttpException("支付配置不存在", 404);
        }
        return paySetting;
    }

    async savePaySetting(aliPay: boolean, weixinPay: boolean): Promise<void> {
        const paySetting: PaySetting = this.paySettingRepository.create({ id: 1, aliPay, weixinPay });
        try {
            await this.paySettingRepository.save(paySetting);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async clearPaySetting(): Promise<void> {
        const paySetting: PaySetting | undefined = await this.paySettingRepository.findOne(1);
        if (!paySetting) {
            throw new HttpException("支付配置不存在", 404);
        }
        try {
            await this.paySettingRepository.remove(paySetting);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }
}
