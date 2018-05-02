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

}