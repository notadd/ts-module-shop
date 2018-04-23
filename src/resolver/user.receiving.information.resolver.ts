import { UserReceivingInformationsData } from "../interface/userreceivinginformation/user.receiving.information.data";
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
        @Inject(UserReceivingInformationService) private readonly userReceivingInformationService: UserReceivingInformationService
    ) { }

    @Query("userReceivingInformation")
    async userReceivingInformation(req: Request, body: {id: number}): Promise<any> {
        const {id} = body;
        if (!id) {
            throw new HttpException("缺少参数", 404);
        }
        const information = await this.userReceivingInformationService.getUserReceivingInformation(id);
        return {code: 200, message: "获取指定用户收货信息成功", information};
    }

    @Query("userReceivingInformations")
    async userReceivingInformations(req: Request, body: { userId: number }): Promise<UserReceivingInformationsData> {
        const { userId } = body;
        if (!userId) {
            throw new HttpException("缺少参数", 404);
        }
        const informations = await this.userReceivingInformationService.getUserReceivingInformations(userId);
        return { code: 200, message: "获取指定用户收货信息成功", informations };
    }

    @Mutation("createUserReceivingInformation")
    async createUserReceivingInformation(req: Request, body: {
        userId: number,
        consignee: string,
        email: string,
        region: string,
        address: string,
        postCode: string,
        homePhone: string,
        mobilePhone: string
    }): Promise<Data> {
        const { userId, consignee, email, region, address, postCode, homePhone, mobilePhone } = body;
        if (!userId || !consignee || !email || !region || !address || !postCode || !homePhone || !mobilePhone) {
            throw new HttpException("缺少参数", 404);
        }
        await this.userReceivingInformationService.createUserReceivingInformation(userId, consignee, email, region, address, postCode, homePhone, mobilePhone);
        return { code: 200, message: "创建用户收货信息成功" };
    }

    @Mutation("updateUserReceivingInformation")
    async updateUserReceivingInformation(req: Request, body: {
        id: number,
        consignee: string,
        email: string,
        region: string,
        address: string,
        postCode: string,
        homePhone: string,
        mobilePhone: string
    }): Promise<Data> {
        const { id, consignee, email, region, address, postCode, homePhone, mobilePhone } = body;
        if (!id || !consignee || !email || !region || !address || !postCode || !homePhone || !mobilePhone) {
            throw new HttpException("缺少参数", 404);
        }
        await this.userReceivingInformationService.updateUserReceivingInformation(id, consignee, email, region, address, postCode, homePhone, mobilePhone);
        return { code: 200, message: "更新用户收货信息成功" };
    }

    @Mutation("deleteUserReceivingInformation")
    async deleteUserReceivingInformation(req: Request, body: { id: number }): Promise<Data> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 404);
        }
        await this.userReceivingInformationService.deleteUserReceivingInformation(id);
        return { code: 200, message: "删除用户收货信息成功" };
    }

}
