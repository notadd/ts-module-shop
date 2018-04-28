import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { PaySettingService } from "../service/pay.setting.service";
import { Resolver, Mutation, Query } from "@nestjs/graphql";
import { Data } from "../interface/data";
import { Request } from "express";

/* 支付方式Resolver */
@Resolver("PaySetting")
@UseInterceptors(ExceptionInterceptor)
export class PaySettingResolver {

    constructor(
        @Inject(PaySettingService) private readonly paySettingService: PaySettingService
    ) { }

    @Mutation("savePaySetting")
    async savePaySetting(req: Request, body: { aliPay: string, weixinPay: string }): Promise<Data> {
        const { aliPay, weixinPay } = body;
        if (aliPay === undefined || aliPay === null || weixinPay === undefined || weixinPay === null) {
            throw new HttpException("缺少参数", 404);
        }
        await this.paySettingService.savePaySetting(aliPay, weixinPay);
        return { code: 200, message: "保存支付设置成功" };
    }

    @Mutation("clearPaySetting")
    async clearPaySetting(req: Request): Promise<Data> {
        await this.paySettingService.clearPaySetting();
        return { code: 200, message: "清除支付配置成功" };
    }
}