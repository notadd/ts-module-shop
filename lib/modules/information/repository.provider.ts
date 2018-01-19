import {Connection} from "typeorm";
import {InformationEntity} from "../entity/information.entity";

export const inforespositoryProvider=[
    {
        provide:"InformationRepositoryToken",
        useFactory:(connection:Connection) =>connection.getRepository(InformationEntity),
        inject:['DbConnectionToken']
    }
]