import {createConnection,Connection} from "typeorm";
import {ArticleEntity} from "../entity/article.entity";
import {ClassifyEntity} from "../entity/classify.entity";
import {PageEntity} from "../entity/page.entity";
import {PageClassifyEntity} from "../entity/pageClassify.entity";
import {PageContentEntity} from "../entity/page.content.entity";
import {SitemapEntity} from "../entity/sitemap.entity";
import {Bucket} from "../ext-local-store/src/model/Bucket";
import {File} from "../ext-local-store/src/model/File";
import {Image} from "../ext-local-store/src/model/Image";
import {ImageConfig} from "../ext-local-store/src/model/ImageConfig";

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
               /* __dirname + '/../!**!/!*.entity.ts',*/
              /*  KindUtil,*/
                ArticleEntity,
                ClassifyEntity,
                Image,
                Bucket,
                PageEntity,
                PageClassifyEntity,
                PageContentEntity,
                SitemapEntity,
                File,
                ImageConfig
            ],
            synchronize: true
        }),
    },
]
