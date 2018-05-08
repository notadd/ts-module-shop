import { Repository } from "typeorm";
import { Member } from "../model/member.entity";
export declare class MemberService {
    private readonly memberRepository;
    constructor(memberRepository: Repository<Member>);
    getMembers(): Promise<Array<Member>>;
    getMember(id: number): Promise<Member>;
    createMember(name: string, realName: string, email: string, sex: string, idNumber: string, birthday: string, password: string, mobilePhone: string): Promise<void>;
    updateMember(id: number, email: string, sex: string, birthday: string, password: string, mobilePhone: string): Promise<void>;
    deleteMember(id: number): Promise<void>;
}
