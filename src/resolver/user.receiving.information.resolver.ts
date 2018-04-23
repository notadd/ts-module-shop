import { UserReceivingInformationService } from "../service/user.receiving.information.service";
import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { Resolver, Query, Mutation } from "@nestjs/graphql";
import { Data } from "../interface/data";
import { Request } from "express";

/* 用户收货信息的Resolver */
@Resolver("UserReceivingInformation")
@UseInterceptors(ExceptionInterceptor)
export class UserReceivingInformationResolver {

    constructor(
        @Inject(UserReceivingInformationService) private readonly userReceivingInformationService: SUserReceivingInformationService
    ) { }

}
