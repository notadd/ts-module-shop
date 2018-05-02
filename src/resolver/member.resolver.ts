import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { MemberService } from "../service/member.service";
import { Resolver, Query, Mutation } from "@nestjs/graphql";
import { Data } from "../interface/data";
import { Request } from "express";


/* 会员Resolver */
@Resolver("Member")
@UseInterceptors(ExceptionInterceptor)
export class MemberResolver {

    constructor(
        @Inject(MemberService) private readonly memberService: MemberService
    ) { }

    @Mutation("createMember")
    async createMember(req: Request, body: {
        name: string,
        realName: string,
        email: string,
        sex: string,
        idNumber: string,
        birthday: string,
        password: string
        mobilePhone: string
    }): Promise<Data> {
        const { name, realName, email, sex, idNumber, birthday, password, mobilePhone } = body;
        if (!name || !realName || !email || !sex || !idNumber || !birthday || !password || !mobilePhone) {
            throw new HttpException("缺少参数", 404);
        }
        await this.memberService.createMember(name, realName, email, sex, idNumber, birthday, password, mobilePhone);
        return { code: 200, message: "创建会员成功" };
    }

}