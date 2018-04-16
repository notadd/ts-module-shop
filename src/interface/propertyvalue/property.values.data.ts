import { PropertyValue } from "../../model/property.value.entity";

export interface PropertyValuesData {
    code: number;
    message: string;
    values: Array<PropertyValue>;
}