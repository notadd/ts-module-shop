import { Sku } from "../../model/sku.entity";
export interface SkusData {
    code: number;
    message: string;
    skus: Array<Sku>;
}
