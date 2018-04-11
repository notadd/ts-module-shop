export interface BrandsData {
    code: number;
    message: string;
    brands: Array<{
        id: number
        name: string
    }>;
}