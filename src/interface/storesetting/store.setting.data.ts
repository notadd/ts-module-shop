export interface StoreSettingData {
    code: number;
    message: string;
    storeSetting: {
        id: number,
        logoBucketName: string,
        logoName: string,
        logoType: string,
        title: string,
        region: string,
        address: string,
        close: boolean,
        closeReason: string,
        servicePhone: string
    };
}
