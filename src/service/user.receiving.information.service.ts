import { UserReceivingInformation } from "../model/user.receiving.information.entity";
import { Component, HttpException, Inject } from "@nestjs/common";
import { PropertyValue } from "../model/property.value.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

/* 用户收货信息的服务组件 */
@Component()
export class UserReceivingInformationService {

    constructor(
        @Inject("UserComponentToken") private readonly userComponent: any,
        @InjectRepository(UserReceivingInformation) private readonly userReceivingInformationRepository: Repository<UserReceivingInformation>
    ) { }


}
