import {Module} from "@nestjs/common";
import {GraphqlResolver} from "./graphql.resolver";
import {ArticleModule} from "../article/article.module";
import {PageModule} from "../page/page.module";
import {ClassifyModule} from "../classify/classify.module";

@Module({
    modules:[ArticleModule,PageModule,ClassifyModule/*SitemapModule*/],
    components:[/*GraphqlResolver*/],
})
export class GraphqlModule{}