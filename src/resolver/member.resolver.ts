import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { MemberData } from "../interface/member/member.data";
import { Resolver, Query, Mutation } from "@nestjs/graphql";
import { MemberService } from "../service/member.service";
import { Data } from "../interface/data";
import { Request } from "express";


/* 会员Resolver */
@Resolver("Member")
@UseInterceptors(ExceptionInterceptor)
export class MemberResolver {

    constructor(
        @Inject(MemberService) private readonly memberService: MemberService
    ) { }

    @Query("members")
    async members(req: Request): Promise<any> {
        const members = await this.memberService.getMembers();
        return { code: 200, message: "获取所有会员成功", members };
    }

    @Query("member")
    async member(req: Request, body: { id: number }): Promise<MemberData> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 404);
        }
        const member = await this.memberService.getMember(id);
        return { code: 200, message: "获取指定id会员成功", member };
    }

    @Mutation("createMember")
    async createMember(req: Request, body: {
        name: string,
        realName: string,
        email: string,
        sex: string,
        idNumber: string,
        birthday: string,
        password: string,
        mobilePhone: string
    }): Promise<Data> {
        const { name, realName, email, sex, idNumber, birthday, password, mobilePhone } = body;
        if (!name || !realName || !email || !sex || !idNumber || !birthday || !password || !mobilePhone) {
            throw new HttpException("缺少参数", 404);
        }
        await this.memberService.createMember(name, realName, email, sex, idNumber, birthday, password, mobilePhone);
        return { code: 200, message: "创建会员成功" };
    }

    @Mutation("updateMember")
    async updateMember(req: Request, body: {
        id: number,
        email: string,
        sex: string,
        birthday: string,
        password: string,
        mobilePhone: string
    }): Promise<Data> {
        const { id, email, sex, birthday, password, mobilePhone } = body;
        if (!id || !email || !sex || !birthday || !password || !mobilePhone) {
            throw new HttpException("缺少参数", 404);
        }
        await this.memberService.updateMember(id, email, sex, birthday, password, mobilePhone);
        return { code: 200, message: "更新会员成功" };
    }

    @Mutation("deleteMember")
    async deleteMember(req: Request, body: { id: number }): Promise<Data> {
        const { id } = body;
        if (!id) {
            throw new HttpException("缺少参数", 404);
        }
        await this.memberService.deleteMember(id);
        return { code: 200, message: "删除会员成功" };
    }

}