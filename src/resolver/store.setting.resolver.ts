import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { StoreSettingService } from "../service/store.setting.service";
import { Resolver, Query, Mutation } from "@nestjs/graphql";
import { Data } from "../interface/data";
import { Request } from "express";

/* 商城设置的Resolver */
@Resolver("StoreSetting")
@UseInterceptors(ExceptionInterceptor)
export class StoreSettingResolver {

    constructor( @Inject(StoreSettingService) private readonly storeSettingService: StoreSettingService) { }


    @Mutation("saveStoreSetting")
    async saveStoreSetting(req: Request, body: {
        logoBucketName: string,
        logoRawName: string,
        logoBase64: string,
        title: string,
        region: string,
        address: string,
        close: string,
        closeReason: string,
        servicePhone: string
    }): Promise<Data> {
        const { logoBucketName, logoRawName, logoBase64, title, region, address, close, closeReason, servicePhone } = body;
        if (!logoBucketName || !logoRawName || !logoBase64 || !title || !region || !address || close === undefined || close === null || !servicePhone) {
            throw new HttpException("缺少参数", 404);
        }
        if (close === "true" && !closeReason) {
            throw new HttpException("商城关闭必须说明关闭原因", 404);
        }
        await this.storeSettingService.saveStoreSetting(logoBucketName, logoRawName, logoBase64, title, region, address, close, closeReason, servicePhone);
        return { code: 200, message: "保存商城设置成功" };
    }

    @Mutation("clearStoreSetting")
    async clearStoreSetting(req: Request): Promise<Data> {
        await this.storeSettingService.clearStoreSetting()
        return { code: 200, message: "清除商城设置成功" }
    }


}