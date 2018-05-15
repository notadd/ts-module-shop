/// <reference types="express" />
import { OutputStoreSetting } from "../interface/storesetting/store.setting.data";
import { StoreComponent } from "../interface/store.component";
import { StoreSetting } from "../model/store.setting.entity";
import { Repository } from "typeorm";
import { Request } from "express";
export declare class StoreSettingService {
    private readonly storeComponent;
    private readonly storeSettingRepository;
    constructor(storeComponent: StoreComponent, storeSettingRepository: Repository<StoreSetting>);
    getStoreSetting(req: Request): Promise<OutputStoreSetting>;
    saveStoreSetting(logoBucketName: string, logoRawName: string, logoBase64: string, title: string, region: string, address: string, close: boolean, closeReason: string, servicePhone: string): Promise<void>;
    clearStoreSetting(): Promise<void>;
}
