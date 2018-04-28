import { Component, HttpException, Inject } from "@nestjs/common";
import { PaySetting } from "../model/pay.setting.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

/* 支付配置服务组件 */
@Component()
export class PaySettingService {

    constructor(
        @InjectRepository(PaySetting) private readonly paySettingRepository: Repository<PaySetting>
    ) { }

    async savePaySetting(aliPay: string, weixinPay: string): Promise<void> {
        const paySetting: PaySetting = this.paySettingRepository.create({ id: 1, aliPay: !!aliPay, weixinPay: !!weixinPay });
        try {
            await this.paySettingRepository.save(paySetting);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async clearPaySetting(): Promise<void> {
        const paySetting: PaySetting | undefined = await this.paySettingRepository.findOneById(1);
        try {
            await this.paySettingRepository.remove(paySetting);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }
}