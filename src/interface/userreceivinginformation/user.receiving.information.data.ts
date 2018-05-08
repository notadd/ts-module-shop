export interface UserReceivingInformationData {
    code: number;
    message: string;
    information: {
        id: number,
        consignee: string,
        email: string,
        region: string,
        address: string,
        postCode: string,
        homePhone: string,
        mobilePhone: string
    };
}
