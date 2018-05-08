/// <reference types="express" />
import { StoreSettingData } from "../interface/storesetting/store.setting.data";
import { StoreSettingService } from "../service/store.setting.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class StoreSettingResolver {
    private readonly storeSettingService;
    constructor(storeSettingService: StoreSettingService);
    storeSetting(req: Request): Promise<StoreSettingData>;
    saveStoreSetting(req: Request, body: {
        logoBucketName: string;
        logoRawName: string;
        logoBase64: string;
        title: string;
        region: string;
        address: string;
        close: string;
        closeReason: string;
        servicePhone: string;
    }): Promise<Data>;
    clearStoreSetting(req: Request): Promise<Data>;
}
