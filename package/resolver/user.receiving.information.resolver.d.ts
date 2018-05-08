/// <reference types="express" />
import { UserReceivingInformationsData } from "../interface/userreceivinginformation/user.receiving.informations.data";
import { UserReceivingInformationData } from "../interface/userreceivinginformation/user.receiving.information.data";
import { UserReceivingInformationService } from "../service/user.receiving.information.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class UserReceivingInformationResolver {
    private readonly userReceivingInformationService;
    constructor(userReceivingInformationService: UserReceivingInformationService);
    userReceivingInformation(req: Request, body: {
        id: number;
    }): Promise<UserReceivingInformationData>;
    userReceivingInformations(req: Request, body: {
        userId: number;
    }): Promise<UserReceivingInformationsData>;
    createUserReceivingInformation(req: Request, body: {
        userId: number;
        consignee: string;
        email: string;
        region: string;
        address: string;
        postCode: string;
        homePhone: string;
        mobilePhone: string;
    }): Promise<Data>;
    updateUserReceivingInformation(req: Request, body: {
        id: number;
        consignee: string;
        email: string;
        region: string;
        address: string;
        postCode: string;
        homePhone: string;
        mobilePhone: string;
    }): Promise<Data>;
    deleteUserReceivingInformation(req: Request, body: {
        id: number;
    }): Promise<Data>;
}
