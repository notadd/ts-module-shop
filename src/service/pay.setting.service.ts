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
}