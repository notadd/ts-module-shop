import { Floor } from "../../model/floor.entity";
export interface FloorsData {
    code: number;
    message: string;
    floors: Array<Floor>;
}
