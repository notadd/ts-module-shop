import { UserReceivingInformation } from "../model/user.receiving.information.entity";
import { Component, HttpException, Inject } from "@nestjs/common";
import { PropertyValue } from "../model/property.value.entity";
import { UserComponent } from "../interface/user.component";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

/* 用户收货信息的服务组件 */
@Component()
export class UserReceivingInformationService {

    constructor(
        @Inject("UserComponentToken") private readonly userComponent: UserComponent,
        @InjectRepository(UserReceivingInformation) private readonly userReceivingInformationRepository: Repository<UserReceivingInformation>
    ) { }

    async getUserReceivingInformations(userId: number): Promise<Array<UserReceivingInformation>> {
        const user: { id: number, userName: string, status: boolean, recycle: boolean }; = await this.userComponent.getUserById(userId);
        if (!user) {
            throw new HttpException("指定id=" + userId + "用户不存在", 404);
        }
        const informations: Array<UserReceivingInformation> = await this.userReceivingInformationRepository.find({ userId });
        return informations;
    }

    async createUserReceivingInformation(
        userId: number,
        consignee: string,
        email: string,
        region: string,
        address: string,
        postCode: string,
        homePhone: string,
        mobilePhone: string
    ): Promise<void> {
        const user: { id: number, userName: string, status: boolean, recycle: boolean }; = await this.userComponent.getUserById(userId);
        if (!user) {
            throw new HttpException("指定id=" + userId + "用户不存在", 404);
        }
        try {
            await this.userReceivingInformationRepository.save({ userId, consignee, email, region, address, postCode, homePhone, mobilePhone });
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async updateUserReceivingInformation(
        id: number,
        consignee: string,
        email: string,
        region: string,
        address: string,
        postCode: string,
        homePhone: string,
        mobilePhone: string
    ): Promise<void> {
        const userReveivingInformation: UserReceivingInformation = await this.userReceivingInformationRepository.findOneById(id);
        if (!userReveivingInformation) {
            throw new HttpException("指定id=" + id + "用户收货信息不存在", 404);
        }
        userReveivingInformation.consignee = consignee;
        userReveivingInformation.email = email;
        userReveivingInformation.region = region;
        userReveivingInformation.address = address;
        userReveivingInformation.postCode = postCode;
        userReveivingInformation.homePhone = homePhone;
        userReveivingInformation.mobilePhone = mobilePhone;
        try {
            await this.userReceivingInformationRepository.save(userReveivingInformation);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async deleteUserReceivingInformation(id: number): Promise<void> {
        const userReveivingInformation: UserReceivingInformation = await this.userReceivingInformationRepository.findOneById(id);
        if (!userReveivingInformation) {
            throw new HttpException("指定id=" + id + "用户收货信息不存在", 404);
        }
        try {
            await this.userReceivingInformationRepository.remove(userReveivingInformation);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

}
