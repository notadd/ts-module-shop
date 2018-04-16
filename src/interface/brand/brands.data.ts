export interface BrandsData {
    code: number;
    message: string;
    brands: Array<{
        id: number
        name: string
        logo: {
            id: number
            bucketName: string
            name: string
            type: string
            url: string
        }
    }>;
}