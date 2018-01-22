import {Mutation, Query, Resolver} from "@nestjs/graphql";
import {ArticleService} from "../article/article.service";
import {ArticleEntity} from "../entity/article.entity";
import {ClassifyService} from "../classify/classify.service";
import {ClassifyEntity} from "../entity/classify.entity";
import {PageService} from "../page/page.service";
import {PageEntity} from "../entity/page.entity";

@Resolver()
export class GraphqlResolver{
    constructor(private readonly articleService:ArticleService,
                private readonly classifyService:ClassifyService,
                private readonly pageService:PageService){}

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
        let date:string=art.publishedTime.toString();
        console.log('time='+date);
        art.publishedTime=new Date(Date.parse(date.replace(/-/g,"/")));
        let newArticle:ArticleEntity=art;
        const result=this.articleService.createArticle(newArticle);
        return result;
    }

    /**
     * 修改文章
     * @param obj
     * @param arg
     * @returns {Promise<ArticleEntity[]>}
     */
    @Mutation()
    updateArticle(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let art:ArticleEntity=map.get('createArt');
        let date:string=art.publishedTime.toString();
        console.log('time='+date);
        art.publishedTime=new Date(Date.parse(date.replace(/-/g,"/")));
        let newArticle:ArticleEntity=art;
        const result=this.articleService.updateArticle(art);
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
     * 获取所有分类
     * @param obj
     * @param arg
     * @returns {Promise<ClassifyEntity[]>}
     */
    @Query()
    getAllClassify(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let useFor:string=map.get('useFor');
        const result=this.classifyService.findAllClassify(useFor);
        return result;
    }

    /**
     * 新增分类
     * @param obj
     * @param arg
     * @returns {Promise<ClassifyEntity[]>}
     */
    @Mutation()
    createClassify(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let useFor:string=map.get('useFor');
        let newClass:ClassifyEntity=map.get('createClass');
        const result=this.classifyService.createClassify(newClass,useFor);
        return result;

    }

    /**
     * 编辑分类
     * @param obj
     * @param arg
     * @returns {Promise<ClassifyEntity[]>}
     */
    @Mutation()
    updateClassify(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let useFor:string=map.get('useFor');
        let newClass:ClassifyEntity=map.get('updateClass');
        const result=this.classifyService.updateClassify(newClass,useFor);
        return result;
    }

    /**
     * 删除分类，分类对应文章的分类改为默认分类
     * @param obj
     * @param arg
     * @returns {Promise<ClassifyEntity[]>}
     */
    @Mutation()
    deleteClassifyById(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let useFor:string=map.get('useFor');
        let id:number=map.get('id');
        const result=this.classifyService.deleteClassify(id,useFor);
        return result;
    }

    /**
     * 获取全部页面
     * @returns {Promise<PageEntity[]>}
     */
    @Query()
    async getAllPage(){
        let  result:PageEntity[]= await this.pageService.getAllPage();
        return result;
    }

    /**
     * 关键字搜索页面
     * @param obj
     * @param arg
     * @returns {Promise<PageEntity[]>}
     */
    @Query()
    serachPages(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let key:string=map.get('keyWords');
        const result=this.pageService.serachKeywords(key);
        return result;
    }

    /**
     * 批量或者单个删除页面
     * @param obj
     * @param arg
     * @returns {Promise<number>}
     */
    @Mutation()
    deletePages(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let array:[number]=map.get('id');
        const result=this.pageService.deletePages(array);
        return result;
    }

    /**
     *新增页面
     * @param obj
     * @param arg
     * @returns {Promise<PageEntity[]>}
     */
    @Mutation()
    createPages(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let page:PageEntity=map.get('createPage');
        const result=this.pageService.createPages(page);
        return result;
    }

    /**
     * 修改页面
     * @param obj
     * @param arg
     * @returns {Promise<PageEntity[]>}
     */
    @Mutation()
    updatePages(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let page:PageEntity=map.get('updatePage');
        const result=this.pageService.updatePages(page);
        return result;
    }
    /**
     * JSON----Map
     * @param obj
     * @returns {Map<string, string>}
     */
    objToStrMap(obj):Map<string,string> {
        let strMap=new Map();
        for (let k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
        }
        return strMap;
    }

}