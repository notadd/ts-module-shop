import {createConnection,Connection} from "typeorm";

export const databaseProvider = [
    {
        provide: 'DbConnectionToken',
        useFactory:  () =>  createConnection({
            type: 'postgres',
            host: 'localhost',
            port: Number(5432),
            username: 'postgres',
            password: '123456',
            database: 'postgres',
            logging:false,
            entities: [
                __dirname + '/../**/*.entity.ts',
            ],
            synchronize: true
        }),
    },
]
