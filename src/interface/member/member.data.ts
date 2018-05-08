import { Member } from "../../model/member.entity";

export interface MemberData {
    code: number;
    message: string;
    member: Member;
}
