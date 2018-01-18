import {Connection} from "typeorm";
import {HistoryEntity} from "../entity/history.entity";

export const hisrespositoryProvider=[
    {
        provide:"HistoryRepositoryToken",
        useFactory:(connection:Connection) =>connection.getRepository(HistoryEntity),
        inject:['DbConnectionToken']
    }
]