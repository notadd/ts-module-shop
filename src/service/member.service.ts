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

    async createMember(
        name: string,
        realName: string,
        email: string,
        sex: string,
        idNumber: string,
        birthday: string,
        password: string,
        mobilePhone: string
    ): Promise<void> {
        const exist: Member | undefined = await this.memberRepository.findOne({ name });
        if (exist) {
            throw new HttpException("指定name=" + name + "会员已存在", 404);
        }
        try {
            await this.memberRepository.save({ name, realName, email, sex, idNumber, birthday, password, mobilePhone });
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async updateMember(
        id: number,
        email: string,
        sex: string,
        birthday: string,
        password: string,
        mobilePhone: string
    ): Promise<void> {
        const member: Member | undefined = await this.memberRepository.findOneById(id);
        if (!member) {
            throw new HttpException("指定id=" + id + "会员不存在", 404);
        }
        member.email = email;
        member.sex = sex;
        member.birthday = new Date(birthday);
        member.password = password;
        member.mobilePhone = mobilePhone;
        try {
            await this.memberRepository.save(member);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async deleteMember(id:number): Promise<void> {
        const member: Member|undefined = await this.memberRepository.findOneById(id);
        if (!member) {
            throw new HttpException("指定id=" + id + "会员不存在", 404);
        }
        try {
            await this.memberRepository.remove(member);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }


}