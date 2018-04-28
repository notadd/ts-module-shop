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
}