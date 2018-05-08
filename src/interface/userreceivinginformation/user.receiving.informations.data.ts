export interface UserReceivingInformationsData {
    code: number;
    message: string;
    informations: Array<{
        id: number,
        consignee: string,
        email: string,
        region: string,
        address: string,
        postCode: string,
        homePhone: string,
        mobilePhone: string
    }>;
}
