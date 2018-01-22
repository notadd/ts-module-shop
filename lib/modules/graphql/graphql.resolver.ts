import {Query, Resolver} from "@nestjs/graphql";
import {ArticleService} from "../article/article.service";

@Resolver()
export class GraphqlResolver{
    constructor(private readonly articleService:ArticleService,){}

    /**
     * 分页获取全部文章
     * @param obj
     * @param arg
     * @returns {Promise<ArticleEntity[]>}
     */
    @Query()
    findAllArticles(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let limit:number=map.get('limitNum');
        const result=this.articleService.getArticleAll(limit);
        return result;

    }
    /**
     * JSON----Map
     * @param obj
     * @returns {Map<string, string>}
     */
    objToStrMap(obj):Map<string,string> {
        let strMap:Map<string,string>;
        for (let k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
        }
        return strMap;
    }

}