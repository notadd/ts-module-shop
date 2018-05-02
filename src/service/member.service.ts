import { Repository, Connection, QueryRunner, SelectQueryBuilder } from "typeorm";
import { Component, HttpException, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Member } from "../model/member.entity";


/* 会员服务组件 */
@Component()
export class MemberService {

    constructor(
        @InjectRepository(Member) private readonly memberRepository: Repository<Member>,

    ) { }

}