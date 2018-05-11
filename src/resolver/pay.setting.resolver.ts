import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { PaySettingData } from "../interface/paysetting/pay.setting.data";
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

    @Query("paySetting")
    async paySetting(): Promise<PaySettingData> {
        const paySetting = await this.paySettingService.getPaySetting();
        return { code: 200, message: "获取支付设置成功", paySetting };
    }

    @Mutation("savePaySetting")
    async savePaySetting(req: Request, body: { aliPay: boolean, weixinPay: boolean }): Promise<Data> {
        const { aliPay, weixinPay } = body;
        if (aliPay === undefined || aliPay === null || weixinPay === undefined || weixinPay === null) {
            throw new HttpException("缺少参数", 404);
        }
        if(aliPay!==true&&aliPay!==false){
            throw new HttpException("参数错误",400);
        }
        if(weixinPay!==true&&weixinPay!==false){
            throw new HttpException("参数错误",400);
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
