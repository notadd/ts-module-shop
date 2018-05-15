export interface StoreSettingData {
    code: number;
    message: string;
    storeSetting: OutputStoreSetting;
}
export interface OutputStoreSetting {
    id: number;
    logoBucketName: string;
    logoName: string;
    logoType: string;
    logoUrl: string;
    title: string;
    region: string;
    address: string;
    close: boolean;
    closeReason: string;
    servicePhone: string;
}
