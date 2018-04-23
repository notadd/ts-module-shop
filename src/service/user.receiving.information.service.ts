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

}
