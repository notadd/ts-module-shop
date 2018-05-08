import { UserReceivingInformation } from "../model/user.receiving.information.entity";
import { Repository } from "typeorm";
import { UserComponent } from "../interface/user.component";
export declare class UserReceivingInformationService {
    private readonly userComponent;
    private readonly userReceivingInformationRepository;
    constructor(userComponent: UserComponent, userReceivingInformationRepository: Repository<UserReceivingInformation>);
    getUserReceivingInformation(id: number): Promise<UserReceivingInformation>;
    getUserReceivingInformations(userId: number): Promise<Array<UserReceivingInformation>>;
    createUserReceivingInformation(userId: number, consignee: string, email: string, region: string, address: string, postCode: string, homePhone: string, mobilePhone: string): Promise<void>;
    updateUserReceivingInformation(id: number, consignee: string, email: string, region: string, address: string, postCode: string, homePhone: string, mobilePhone: string): Promise<void>;
    deleteUserReceivingInformation(id: number): Promise<void>;
}
