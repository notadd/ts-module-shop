import { Connection } from 'typeorm';
export declare const ConnectionProvider: {
    provide: string;
    useFactory: () => Promise<Connection>;
};
