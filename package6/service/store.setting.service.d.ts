import { StoreComponent } from "../interface/store.component";
import { StoreSetting } from "../model/store.setting.entity";
import { Repository } from "typeorm";
export declare class StoreSettingService {
    private readonly storeComponent;
    private readonly storeSettingRepository;
    constructor(storeComponent: StoreComponent, storeSettingRepository: Repository<StoreSetting>);
    getStoreSetting(): Promise<StoreSetting>;
    saveStoreSetting(logoBucketName: string, logoRawName: string, logoBase64: string, title: string, region: string, address: string, close: string, closeReason: string, servicePhone: string): Promise<void>;
    clearStoreSetting(): Promise<void>;
}
