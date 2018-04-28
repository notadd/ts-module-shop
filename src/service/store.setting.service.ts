import { Component, HttpException, Inject } from "@nestjs/common";
import { StoreSetting } from "../model/store.setting.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

/* 商城设置的服务组件 */
@Component()
export class StoreSettingService {

    constructor(
        @InjectRepository(StoreSetting) private readonly storeSettingRepository: Repository<StoreSetting>
    ) { }

}
