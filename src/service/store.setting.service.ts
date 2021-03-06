import { OutputStoreSetting } from "../interface/storesetting/store.setting.data";
import { Injectable, HttpException, Inject } from "@nestjs/common";
import { StoreComponent } from "../interface/store.component";
import { StoreSetting } from "../model/store.setting.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request } from "express";

/* 商城设置的服务组件 */
@Injectable()
export class StoreSettingService {

    constructor(
        @Inject("StoreComponentToken") private readonly storeComponent: StoreComponent,
        @InjectRepository(StoreSetting) private readonly storeSettingRepository: Repository<StoreSetting>
    ) { }

    async getStoreSetting(req: Request): Promise<OutputStoreSetting> {
        const storeSetting: any = await this.storeSettingRepository.findOne(1);
        if (!storeSetting) {
            throw new HttpException("商城配置不存在", 404);
        }
        storeSetting.logoUrl = await this.storeComponent.getUrl(req, storeSetting.logoBucketName, storeSetting.logoName, storeSetting.logoType, undefined);
        return storeSetting;
    }

    async saveStoreSetting(
        logoBucketName: string,
        logoRawName: string,
        logoBase64: string,
        title: string,
        region: string,
        address: string,
        close: boolean,
        closeReason: string,
        servicePhone: string
    ): Promise<void> {
        const { bucketName, name, type } = await this.storeComponent.upload(logoBucketName, logoRawName, logoBase64, undefined);
        try {
            const setting: StoreSetting = this.storeSettingRepository.create({
                id: 1,
                logoBucketName: bucketName,
                logoName: name,
                logoType: type,
                title,
                region,
                address,
                close,
                closeReason,
                servicePhone
            });
            await this.storeSettingRepository.save(setting);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async clearStoreSetting(): Promise<void> {
        const setting: StoreSetting | undefined = await this.storeSettingRepository.findOne(1);
        if (!setting) {
            throw new HttpException("商城设置不存在", 404);
        }
        try {
            await this.storeComponent.delete(setting.logoBucketName, setting.logoName, setting.logoType);
            await this.storeSettingRepository.remove(setting);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

}
