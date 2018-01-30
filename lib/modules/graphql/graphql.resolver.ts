import {Mutation, Query, Resolver} from "@nestjs/graphql";
import {ArticleService} from "../article/article.service";
import {ArticleEntity} from "../entity/article.entity";
import {ClassifyService} from "../classify/classify.service";
import {ClassifyEntity} from "../entity/classify.entity";
import {PageService} from "../page/page.service";
import {PageEntity} from "../entity/page.entity";
import {PageClassifyEntity} from "../entity/pageClassify.entity";
import {PageContentEntity} from "../entity/page.content.entity";
import {ContentMap} from "../common/param.dto";

@Resolver()
export class GraphqlResolver{
    constructor(private readonly articleService:ArticleService,
                private readonly classifyService:ClassifyService,
                private readonly pageService:PageService){}

    /**
     * 文章的查询方法
     * @param obj
     * @param arg
     * @returns {Promise<ArticleEntity[]>}
     */

    @Query()
    getArticles(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let getArticle=map.get('getArticleAll');
        if(getArticle!=null || getArticle!=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getArticle);
            const result=this.articleService.getArticleAll(amap.get('limitNum'),amap.get('hidden'));
            return result;
        }
        let keywordsSerach=map.get('keywordsSerach');
        if(keywordsSerach!=null || keywordsSerach!=undefined){
            let amap=new Map();
            amap=this.objToStrMap(keywordsSerach);
            const result=this.articleService.serachArticles(amap.get('keywords'),amap.get('limitNum'));
            return result;
        }
        let recycleFind=map.get('recycleFind');
        if(recycleFind!=null || recycleFind !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(recycleFind);
            const result=this.articleService.recycleFind(amap.get('limitNum'));
            return result;
        }
        let reductionGetByClassifyId=map.get('reductionGetByClassifyId');
        if(reductionGetByClassifyId!=null || reductionGetByClassifyId !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(reductionGetByClassifyId);
            const result=this.articleService.reductionClassity(amap.get('id'),amap.get('limitNum'));
            return result;
        }
        let showNext=map.get('showNext');
        if(showNext!=null || showNext !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(showNext);
            const result=this.classifyService.showNextTitle(amap.get('id'));
            return result;
        }
        let getArticleByClassifyId=map.get('getArticleByClassifyId');
        if(getArticleByClassifyId!=null || getArticleByClassifyId !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getArticleByClassifyId);
            const result=this.classifyService.getArticelsByClassifyId(amap.get('id'),amap.get('limitNum'));
            return result;
        }
        let findTopPlace=map.get('findTopPlace');
        if(findTopPlace!=null || findTopPlace !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(findTopPlace);
            const result= this.articleService.findTopPlace(amap.get('limitNum'));
            return result;
        }
        let getArticleById=map.get('getArticleById');
        if(getArticleById!=null || getArticleById !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getArticleById);
            const result= this.articleService.getArticleById(amap.get('id'));
            return result;
        }
    }

    /**
     * 获取分类
     * @param obj
     * @param arg
     * @returns {any}
     */
    @Query()
    getClassifys(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let getAllClassify=map.get('getAllClassify');
        if(getAllClassify!=null || getAllClassify !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getAllClassify);
            let useFor:string=amap.get('useFor');
            let id:number=amap.get('id');
            if(id==null || id==0){
                id=1;
            }
            let result;
            if(useFor=='art'){
                result=this.classifyService.findAllClassifyArt(id);
            }else if(useFor=='page'){
                result=this.classifyService.findAllClassifyPage(id);
            }
            return result;
        }
    }

    /**
     * 获取页面
     * @param obj
     * @param arg
     * @returns {Promise<PageEntity[]>}
     */
    @Query()
    getPages(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let getAllPage=map.get('getAllPage');
        if(getAllPage!=null || getAllPage !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getAllPage);
            const result=this.pageService.getAllPage(amap.get('limitNum'));
            return result;
        }
        let serachPages=map.get('serachPages');
        if(serachPages!=null || serachPages !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(serachPages);
            const result=this.pageService.serachKeywords(amap.get('keywords'),amap.get('limitNum'));
            return result;
        }
        let getPagesByClassifyId=map.get('getPagesByClassifyId');
        if(getPagesByClassifyId!=null || getPagesByClassifyId !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getPagesByClassifyId);
            const result=this.pageService.findPageByClassifyId(amap.get('id'),amap.get('limitNum'));
            return result;
        }
        let findPageById=map.get('findPageById');
        if(findPageById!=null || findPageById !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(findPageById);
            const result=this.pageService.findPageById(amap.get('id'));
            return result;
        }
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
    async createArticle(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let art:ArticleEntity=map.get('createArt');
        let date:string=art.publishedTime.toString();
        art.publishedTime=new Date(Date.parse(date.replace(/-/g,"/")));
        let newArticle:ArticleEntity=art;
        const result=await this.articleService.createArticle(newArticle).then(a=>{return a});
        let final:string=JSON.stringify(result);
        return final;
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
        art.publishedTime=new Date(Date.parse(date.replace(/-/g,"/")));
        let newArticle:ArticleEntity=art;
        const result=this.articleService.updateArticle(newArticle).then(a=>{return a});
        let final:string=JSON.stringify(result);
        return final;
    }

    /**
     * 回收站内批量或者单个删除文章
     * @param obj
     * @param arg
     * @returns {Promise<number>}
     */
    @Mutation()
   async recycleDelete(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let array:[number]=map.get('id');
        let num:number=await this.articleService.recycleDelete(array);
        let string=`已经成功删除${num}条数据`;
        return string;
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
        const num=this.articleService.reductionArticle(array,map.get('limitNum'));
        let result:string=`成功将${num}条数据还原`;
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
        let result;
        if(useFor=='art'){
            let newClass:ClassifyEntity=map.get('createClass');
            result=this.classifyService.createClassifyArt(newClass);
        }else if(useFor=='page'){
            let newClass:PageClassifyEntity=map.get('createClass');
            result=this.classifyService.createClassifyPage(newClass);
        }
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
        let result;
        if(useFor=='art'){
            let newClass:ClassifyEntity=map.get('updateClass');
            result=this.classifyService.updateClassifyArt(newClass);
        }else if(useFor=='page'){
            let newClass:PageClassifyEntity=map.get('updateClass');
            result=this.classifyService.updateClassifyPage(newClass);
        }
        return result;
    }

    /**
     * 移动分类
     * @param obj
     * @param arg
     * @returns {any}
     */
    @Mutation()
    mobileTheClassify(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let useFor:string=map.get('useFor');
        let result;
        if(useFor=='art'){
            result=this.classifyService.mobileClassifyArt(map.get('id'),map.get('parentId'));
        }else if(useFor=='page'){
            result=this.classifyService.mobileClassifyArt(map.get('id'),map.get('parentId'));
        }
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
        let result;
        if(useFor=='art'){
            result=this.classifyService.deleteMethodFirst(id);
        }else if(useFor=='page'){
            result=this.classifyService.deleteMethodSecond(id);
        }
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
        let page:PageEntity=new PageEntity();
        page.title=map.get('title');
        page.alias=map.get('alias');
        page.classify=map.get('classify');
        let contents:PageContentEntity[]=[];
        let strFinal:string[]=map.get('content');
        for(let t in strFinal){
            let newContent:PageContentEntity=new PageContentEntity;
            newContent.content=strFinal[t];
            contents.push(newContent);
        }
        const result=this.pageService.createPages(page,contents);
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
        let page:PageEntity=new PageEntity();
        page.title=map.get('title');
        page.alias=map.get('alias');
        page.classify=map.get('classify');
        let contents:PageContentEntity[]=[];
        let strFinal:ContentMap[]=map.get('content');
        for(let t in strFinal){
            let newContent:PageContentEntity=new PageContentEntity;
            newContent.content=strFinal[t].content;
            newContent.id=strFinal[t].id;
            contents.push(newContent);
        }
        const result=this.pageService.updatePages(page,contents);
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