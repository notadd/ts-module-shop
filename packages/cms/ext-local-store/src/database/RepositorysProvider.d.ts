import { Connection, Repository } from 'typeorm';
export declare class RepositoryProvider {
    provide: string;
    useFactory: (connection: Connection) => Repository<any>;
    inject: string[];
}
export declare let RepositorysProvider: Array<RepositoryProvider>;
