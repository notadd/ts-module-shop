import {Mutation, Query, Resolver} from "@nestjs/graphql";
import {ArticleService} from "../article/article.service";
import {ArticleEntity} from "../entity/article.entity";

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
    getArticleAll(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let limit:number=map.get('limitNum');
        const result=this.articleService.getArticleAll(limit);
        return result;

    }

    /**
     * 分页根据关键字搜索
     * @param obj
     * @param arg
     * @returns {Promise<ArticleEntity[]>}
     */
    @Query()
    keywordsSerach(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let limit:number=map.get('limitNum');
        let keyWords:string=map.get('keywords');
        const result=this.articleService.serachArticles(keyWords,limit);
        return result;
    }

    /**
     * 文章放入回收站
     * @param obj
     * @param arg
     * @returns {Promise<number>}
     */
    @Mutation()
    deleteById(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let array:[number]=map.get('id');
        const result=this.articleService.deleteArticles(array);
        return result;
    }

    /**
     * 创建文章
     * @param obj
     * @param arg
     * @returns {Promise<void>}
     */
    @Mutation()
    createArticle(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let art:ArticleEntity=map.get('createArt');
        const result=this.articleService.createArticle(art);
        return result;
    }

    /**
     * 回收站内分页获取文章
     * @param obj
     * @param arg
     * @returns {Promise<ArticleEntity[]>}
     */
    @Mutation()
    recycleFind(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let limitNum:number=map.get('limitNum');
        const result=this.articleService.recycleFind(limitNum);
        return result;
    }

    /**
     * 回收站内批量或者单个删除文章
     * @param obj
     * @param arg
     * @returns {Promise<number>}
     */
    @Mutation()
    recycleDelete(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let array:[number]=map.get('id');
        const result=this.articleService.recycleDelete(array);
        return result;
    }

    /**
     * 回收站内还原文章
     * @param obj
     * @param arg
     * @returns {Promise<ArticleEntity[]>}
     */
    @Mutation()
    reductionArticle(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let array:[number]=map.get('id');
        const result=this.articleService.reductionArticle(array);
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