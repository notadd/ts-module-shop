import { Member } from "../../model/member.entity";

export interface MembersData {
    code: number;
    message: string;
    members: Array<Member>;
}