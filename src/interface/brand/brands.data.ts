export interface BrandsData {
    code: number;
    message: string;
    brands: Array<{
        id: number
        name: string
        logo: OutputBrandLogo
    }>;
}

export interface OutputBrandLogo {
    id: number;
    bucketName: string;
    name: string;
    type: string;
    url: string;
}
