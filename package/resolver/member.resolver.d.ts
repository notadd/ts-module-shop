/// <reference types="express" />
import { MembersData } from "../interface/member/members.data";
import { MemberData } from "../interface/member/member.data";
import { MemberService } from "../service/member.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class MemberResolver {
    private readonly memberService;
    constructor(memberService: MemberService);
    members(req: Request): Promise<MembersData>;
    member(req: Request, body: {
        id: number;
    }): Promise<MemberData>;
    createMember(req: Request, body: {
        name: string;
        realName: string;
        email: string;
        sex: string;
        idNumber: string;
        birthday: string;
        password: string;
        mobilePhone: string;
    }): Promise<Data>;
    updateMember(req: Request, body: {
        id: number;
        email: string;
        sex: string;
        birthday: string;
        password: string;
        mobilePhone: string;
    }): Promise<Data>;
    deleteMember(req: Request, body: {
        id: number;
    }): Promise<Data>;
}
