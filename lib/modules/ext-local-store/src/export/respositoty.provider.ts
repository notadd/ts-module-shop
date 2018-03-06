import {Bucket} from "../model/Bucket";
import {Connection} from "typeorm";
import {Image} from "../model/Image";

export const ImageRepositoryProvider=[
    {
        provide:"ImageRepositoryToken",
        useFactory:(connection:Connection) =>connection.getRepository(Image),
        inject:['DbConnectionToken']
    }
]
export const BucketRepositoryProvider=[
    {
        provide:"BucketRepositoryToken",
        useFactory:(connection:Connection) =>connection.getRepository(Bucket),
        inject:['DbConnectionToken']
    }
]