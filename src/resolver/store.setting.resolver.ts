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

}