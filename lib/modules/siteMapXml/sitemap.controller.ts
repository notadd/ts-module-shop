import {Mutation, Query, Resolver} from "@nestjs/graphql";
import {ArticleService} from "../article/article.service";
import {Article, ArticleEntity} from "../entity/article.entity";
import {ClassifyService} from "../classify/classify.service";
import {ClassifyEntity} from "../entity/classify.entity";
import {PageService} from "../page/page.service";
import {Page, PageEntity} from "../entity/page.entity";
import {PageClassifyEntity} from "../entity/pageClassify.entity";
import {PageContentEntity} from "../entity/page.content.entity";
import {ContentMap} from "../common/param.dto";
import {MessageCodeError} from "../errorMessage/error.interface";
import {CreateXmlVm} from "./models/view/create-xml-vm";
import {SitemapXMLService} from "./sitemap.service";
import {CreatePageVm} from "./models/view/create-page.vm";
import {GetPageVm} from "./models/view/get-page.vm";
import {ClassifyCurdVm} from "./models/view/classify-curd.vm";
import {ArticleCurdVm} from "./models/view/article-curd.vm";

const clc=require('cli-color');
@Resolver()
export class SitemapResolver{
    constructor(private readonly articleService:ArticleService,
                private readonly classifyService:ClassifyService,
                private readonly pageService:PageService,
                private readonly sitemapService:SitemapXMLService
    ){}

    /**
     * 创建地图xml文件
     * @param obj
     * @param arg
     * @returns {Promise<CreateParamDto>}
     */
    @Query()
    async createFile(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let createxml:CreateXmlVm=map.get('buildxml');
        const result=this.sitemapService.createXml(createxml);
        console.log('controller='+JSON.stringify(createxml));
        return createxml;
    }

    /**
     * 修改地图xml文件
     * @param obj
     * @param arg
     * @returns {Promise<CreateParamDto>}
     */
    @Query()
    async updateFile(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let createxml:CreateXmlVm=map.get('updateFile');
        const result=this.sitemapService.upDateXml();
        console.log('controller='+JSON.stringify(createxml));
        return createxml;
    }
    /**
     * 文章分页的查询方法
     * @param obj
     * @param arg
     * @returns {Promise<ArticleEntity[]>}
     */

    @Query()
    async getArticlesLimit(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let resultPage;
        let result:Article[];
        let getArticle=map.get('getArticleAll');
        let articleVM:ArticleCurdVm=new ArticleCurdVm();
        if(getArticle!=null || getArticle!=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getArticle);
            articleVM.getArticles={getArticleAll:true,hidden:amap.get('hidden')};
            articleVM.limitNum=amap.get('limitNum');
            articleVM.pages=amap.get('pages');
           // let resultArt=await this.sitemapService.articleCurd(articleVM);
            //let resultArt=await this.articleService.getArticleAll(amap.get('limitNum'),amap.get('hidden'),amap.get('pages')).then(a=>{return a});
          //  resultPage=await this.classifyService.pageServiceArt(resultArt.totalItems,amap.get('limitNum'),amap.get('pages')).then(a=>{return a});
          //  result=await this.classifyService.TimestampArt(resultArt.articles);
        }
        let keywordsSerach=map.get('keywordsSerach');
        if(keywordsSerach!=null || keywordsSerach!=undefined){
            let amap=new Map();
            amap=this.objToStrMap(keywordsSerach);
            articleVM.getArticles={keywordsSerach:amap.get('keywords')};
            articleVM.limitNum=amap.get('limitNum');
            articleVM.pages=amap.get('pages');
            //let resultArt=await this.articleService.serachArticles(amap.get('keywords'),amap.get('limitNum'),amap.get('pages')).then(a=>{return a});
            // let resultArt=await this.articleService.serachArticles(amap.get('keywords'),amap.get('limitNum'),amap.get('pages')).then(a=>{return a});
            //resultPage=await this.classifyService.pageServiceArt(resultArt.totalItems,amap.get('limitNum'),amap.get('pages')).then(a=>{return a});
            //result=await this.classifyService.TimestampArt(resultArt.articles);
        }
        let recycleFind=map.get('recycleFind');
        if(recycleFind!=null || recycleFind !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(recycleFind);
            articleVM.getArticles={recycleFind:true};
            articleVM.limitNum=amap.get('limitNum');
            articleVM.pages=amap.get('pages');
            //let resultArt=await this.articleService.recycleFind(amap.get('limitNum'),amap.get('pages')).then(a=>{return a});
            //result=await this.classifyService.TimestampArt(resultArt.articles);
            //resultPage=await this.classifyService.pageServiceArt(resultArt.totalItems,amap.get('limitNum'),amap.get('pages')).then(a=>{return a});
        }
        let reductionGetByClassifyId=map.get('reductionGetByClassifyId');
        if(reductionGetByClassifyId!=null || reductionGetByClassifyId !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(reductionGetByClassifyId);
            articleVM.getArticles={reductionGetByClassifyId:amap.get('id')};
            articleVM.limitNum=amap.get('limitNum');
            articleVM.pages=amap.get('pages');
            // let resultArt=await this.articleService.reductionClassity(amap.get('id'),amap.get('limitNum'),amap.get('pages')).then(a=>{return a});
            //resultPage=await this.classifyService.pageServiceArt(resultArt.totalItems,amap.get('limitNum'),amap.get('pages')).then(a=>{return a});
            //result=await this.classifyService.TimestampArt(resultArt.articles);
        }
        let getArticleByClassifyId=map.get('getArticleByClassifyId');
        //未知是否添加是否置顶选项
        if(getArticleByClassifyId!=null || getArticleByClassifyId !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getArticleByClassifyId);
            articleVM.getArticles={getArticleByClassifyId:amap.get('id')};
            articleVM.limitNum=amap.get('limitNum');
            articleVM.pages=amap.get('pages');
            //let resultArt=await this.classifyService.getArticelsByClassifyId(amap.get('id'),amap.get('limitNum'),amap.get('show'),amap.get('pages')).then(a=>{return a});
            //resultPage=await this.classifyService.pageServiceArt(resultArt.totalItems,amap.get('limitNum'),amap.get('pages')).then(a=>{return a});
            //result=await this.classifyService.TimestampArt(resultArt.articles);
        }
        let findTopPlace=map.get('findTopPlace');
        if(findTopPlace!=null || findTopPlace !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(findTopPlace);
            articleVM.getArticles={findTopPlace:true};
            articleVM.limitNum=amap.get('limitNum');
            articleVM.pages=amap.get('pages');
            //let resultArt=await this.articleService.findTopPlace(amap.get('limitNum'),amap.get('pages')).then(a=>{return a});
            //resultPage=await this.classifyService.pageServiceArt(resultArt.totalItems,amap.get('limitNum'),amap.get('pages')).then(a=>{return a});
            //result=await this.classifyService.TimestampArt(resultArt.articles)
        }
        articleVM.getAllArticles=true;
        let resultArt=await this.sitemapService.articleCurd(articleVM);
        let resultArtAgain=await this.articleService.getArticleAll(articleVM.limitNum,articleVM.hidden,articleVM.pages);
        resultPage=await this.classifyService.pageServiceArt(resultArtAgain.totalItems,articleVM.limitNum,articleVM.pages).then(a=>{return a});
        result=await this.classifyService.TimestampArt(resultArtAgain.articles);
        return {pagination:resultPage,articles:result};

    }

    /**
     * 不分页获取文章
     * @param obj
     * @param argclassify_curd
     * @returns {Promise<any>}
     */
    @Query()
    async getArticlesNoLimit(obj,arg) {
        const str: string = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        let articleVM:ArticleCurdVm=new ArticleCurdVm();
        let showNext=map.get('showNext');
        let result:Article[];
        if(showNext!=null || showNext !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(showNext);
            articleVM.getArticles={showNext:amap.get('id')};
          /*  let entity:ArticleEntity[]=await this.sitemapService.articleCurd(articleVM);
            //let entity:ArticleEntity[]=await this.classifyService.showNextTitle(amap.get('id')).then(a=>{return a});
             result=await this.classifyService.TimestampArt(entity);
            return result;*/
        }
        let getArticleById=map.get('getArticleById');
        if(getArticleById!=null || getArticleById !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getArticleById);
            articleVM.getArticles={getArticleById:amap.get('id')};
          /*  let entity:ArticleEntity[]= await this.articleService.getArticleById(amap.get('id'));
            const result=this.classifyService.TimestampArt(entity);
            return result;*/
        }
        let superiorArticle=map.get('superiorArticle');
        if(superiorArticle!=null || superiorArticle !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(superiorArticle);
            articleVM.getArticles={superiorArticle:amap.get('id')};
           /* let entity:ArticleEntity[]=await t        articleVM.getAllArticles=true;
his.classifyService.showBeforeTitle(amap.get('id'));
            const result=this.classifyService.TimestampArt(entity);
            return result;*/
        }
        let getCurrentClassifyArticles=map.get('getCurrentClassifyArticles');
        if(getCurrentClassifyArticles!=null || getCurrentClassifyArticles !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getCurrentClassifyArticles);
            articleVM.getArticles={getCurrentClassifyArticles:amap.get('id')};
          /*  let entity:ArticleEntity[]=await this.classifyService.showCurrentArticles(amap.get('id'));
            const result=this.classifyService.TimestampArt(entity);
            return result;*/
        }
        //未定是否开放
      /*  let getLevelByClassifyId=map.get('getLevelByClassifyId');
        if(getLevelByClassifyId!=null || getLevelByClassifyId !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getLevelByClassifyId);
            articleVM.getArticles={getLevelByClassifyId:amap.get('id')};
           /!* const result=this.articleService.getLevelByClassifyId(amap.get('id'));
            return result;*!/
        }*/
        articleVM.getAllArticles=true;
        let entity:ArticleEntity[]=await this.sitemapService.articleCurd(articleVM);
        result=await this.classifyService.TimestampArt(entity);
        return result;

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
            let classifyVM:ClassifyCurdVm=new ClassifyCurdVm();
            classifyVM.useFor=useFor;
            classifyVM.getAllClassify=true;
            let result=this.sitemapService.getClassify(classifyVM);
           /* let result;
            if(useFor=='art'){
                result=this.classifyService.findAllClassifyArt(id);
            }else if(useFor=='page'){
                result=this.classifyService.findAllClassifyPage(id);
            }*/
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
    async getPagesLimit(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let PageReturn:Page[];
        let pagination;
        let getAllPage=map.get('getAllPage');
        let pageParam:GetPageVm=new GetPageVm();
        if(getAllPage!=null || getAllPage !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getAllPage);
            pageParam.getAll=true;
            pageParam.limit=amap.get('limitNum');
            pageParam.pages=amap.get('pages');
            /*let resultPage=await this.sitemapService.getPages(pageParam).then(a=>{return a});
            //let resultPage=await this.pageService.getAllPage(amap.get('limitNum'),amap.get('pages')).then(a=>{return a});
            PageReturn=await this.classifyService.TimestampPage(resultPage.pages);
            pagination=await this.classifyService.pageServiceArt(resultPage.totalItems,pageParam.limit,pageParam.pages);*/

        }
        let serachPages=map.get('serachPages');
        if(serachPages!=null || serachPages !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(serachPages);
            let pageParam:GetPageVm=new GetPageVm();
            pageParam.keywords=amap.get('keywords');
            pageParam.limit=amap.get('limitNum');
            pageParam.pages=amap.get('pages');
           /* let resultPage=await this.sitemapService.getPages(pageParam).then(a=>{return a});
            //let resultPage=await this.pageService.serachKeywords(amap.get('keywords'),amap.get('limitNum'),amap.get('pages')).then(a=>{return a});
            PageReturn=await this.classifyService.TimestampPage(resultPage.pages);
            pagination=await this.classifyService.pageServiceArt(resultPage.totalItems,amap.get('limitNum'),amap.get('pages'));*/
        }
        let getPagesByClassifyId=map.get('getPagesByClassifyId');
        if(getPagesByClassifyId!=null || getPagesByClassifyId !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getPagesByClassifyId);
            let pageParam:GetPageVm=new GetPageVm();
            pageParam.classifyId=amap.get('id');
            pageParam.limit=amap.get('limitNum');
            pageParam.pages=amap.get('pages');
           /* let resultPage=await this.sitemapService.getPages(pageParam).then(a=>{return a});
           // let resultPage=await this.pageService.findPageByClassifyId(amap.get('id'),amap.get('limitNum'),amap.get('pages')).then(a=>{return a});
            PageReturn=await this.classifyService.TimestampPage(resultPage.pages);
            pagination=await this.classifyService.pageServiceArt(resultPage.totalItems,amap.get('limitNum'),amap.get('pages'));*/
        }
        let resultPage=await this.sitemapService.getPages(pageParam).then(a=>{return a});
        PageReturn=await this.classifyService.TimestampPage(resultPage.pages);
        pagination=await this.classifyService.pageServiceArt(resultPage.totalItems,pageParam.limit,pageParam.pages);
        return{pagination:pagination,pages:PageReturn};
    }

    /**
     * 获取单个页面
     * @param obj
     * @param arg
     * @returns {Promise<PageEntity[]>}
     */
    @Query()
    getPageById(obj,arg) {
        const str: string = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        let findPageById=map.get('findPageById');
        if(findPageById!=null || findPageById !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(findPageById);
            let pageParam:GetPageVm=new GetPageVm();
            pageParam.classifyId=amap.get('id');
            const result=this.sitemapService.getPages(pageParam);
            //const result=this.pageService.findPageById(amap.get('id'));
            return result;
        }
    }

    /**
     * 文章的增加和修改
     * @param obj
     * @param arg
     * @returns {Promise<string>}
     * @constructor
     */
    @Mutation()
    async ArticleCU(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let createArt=map.get('createArt');
        let articleVM:ArticleCurdVm=new ArticleCurdVm();
        articleVM.limitNum=map.get('limitNum');
        articleVM.pages=map.get('pages');
        articleVM.hidden=map.get('hidden');
        if(createArt!=null || createArt !=undefined){
            let art:ArticleEntity=createArt;
            if(art.publishedTime!=null){
                let date:string=art.publishedTime.toString();
                art.publishedTime=new Date(Date.parse(date.replace(/-/g,"/")));
            }
            let newArticle:ArticleEntity=art;
            articleVM.createArticle=newArticle;
            /*const result=await this.articleService.createArticle(newArticle).then(a=>{return a});
            let final:string=JSON.stringify(result);
            return final;*/
        }
        let updateArt=map.get('updateArt');
        if(updateArt!=null || updateArt !=undefined){
            let art:ArticleEntity=updateArt;
            if(art.publishedTime!=null){
                let date:string=art.publishedTime.toString();
                art.publishedTime=new Date(Date.parse(date.replace(/-/g,"/")));
            }
            let newArticle:ArticleEntity=art;
            articleVM.updateArticle=newArticle;
           /* const result=await this.articleService.updateArticle(newArticle).then(a=>{return a});
            let final:string=JSON.stringify(result);
            return final;*/
        }
        let deleteById=map.get('deleteById');
        if(deleteById!=null || deleteById !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(deleteById);
            let array:[number]=amap.get('id');
            articleVM.deleteById=array;
            //let result=await this.sitemapService.articleCurd(articleVM);
            //return result;
           /* let result:number=await this.articleService.deleteArticles(array).then(a=>{return a});
            let strResult:string=`已成功将${JSON.stringify(result)}条数据放入回收站`;
            return strResult;*/
        }
        let recycleDelete=map.get('recycleDelete');
        if(recycleDelete!=null || recycleDelete !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(recycleDelete);
            let array:[number]=amap.get('id');
            articleVM.recycleDelete=array;
           /* let num:number=await this.articleService.recycleDelete(array);
            let string=`已经成功删除${num}条数据`;
            return string;*/
        }
        let reductionArticle=map.get('reductionArticle');
        if(reductionArticle!=null || reductionArticle !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(reductionArticle);
            let array:[number]=amap.get('id');
            articleVM.reductionArticle=array;
           /* const num=await this.articleService.reductionArticle(array);
            let result:string=`成功将${num}条数据还原`;
            return result;*/
        }
        //批量反向置顶,暂不修改
        let classifyTopPlace=map.get('classifyTopPlace');
        if(classifyTopPlace!=null || classifyTopPlace !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(classifyTopPlace);
            let id:number=amap.get('id');
            const num=await this.classifyService.classifyTopPlace(id,amap.get('display'));
            let result:string=`成功将${num}条数据置顶`;
            return result;
        }
        console.log(clc.blueBright('articleCurd='+JSON.stringify(articleVM)));
        let resultArt=await this.sitemapService.articleCurd(articleVM);
        //let resultPage=await this.classifyService.pageServiceArt(resultArt.totalItems,articleVM.limitNum,articleVM.pages).then(a=>{return a});
        //let result=await this.classifyService.TimestampArt(resultArt.articles);
       // return {pagination:resultPage,articles:result};
    }

    /**
     * 分类的增加、修改 分文章和页面两种
     * @param obj
     * @param arg
     * @returns {any}
     * @constructor
     */
    @Mutation()
    ClassifyCU(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let createArt=map.get('createClass');
        let classifyVM:ClassifyCurdVm=new ClassifyCurdVm();
        if(createArt!=null || createArt !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(createArt);
            let useFor:string=amap.get('useFor');
            //let result;
            let id:number=amap.get('id');
            if(id==null || id==0){
                id=1;
            }
            classifyVM.useFor=useFor;
            classifyVM.createClassify=amap.get('createClass');
           /* if(useFor=='art'){
                let newClass:ClassifyEntity=amap.get('createClass');
                result=this.classifyService.createClassifyArt(newClass,id);
            }else if(useFor=='page'){
                let newClass:PageClassifyEntity=amap.get('createClass');
                result=this.classifyService.createClassifyPage(newClass,id);
            }*/
           // return result;
        }
        let updateClass=map.get('updateClass');
        if(updateClass!=null || updateClass !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(updateClass);
            let useFor:string=amap.get('useFor');
            let id:number=amap.get('id');
            if(id==null || id==0){
                id=1;
            }
            //let result;
            //let classifyVM:ClassifyCurdVm=new ClassifyCurdVm();
            classifyVM.useFor=useFor;
            classifyVM.updateClassify=amap.get('updateClass');
           // let result=this.sitemapService.classifyCurd(classifyVM);
           /* if(useFor=='art'){
                let newClass:ClassifyEntity=amap.get('updateClass');
                result=this.classifyService.updateClassifyArt(newClass,id);
            }else if(useFor=='page'){
                let newClass:PageClassifyEntity=amap.get('updateClass');
                result=this.classifyService.updateClassifyPage(newClass,id);
            }*/
            //return result;
        }
        let deleteClassifyById=map.get('deleteClassifyById');
        if(deleteClassifyById!=null || deleteClassifyById !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(deleteClassifyById);
            let useFor:string=amap.get('useFor');
            let id:number=amap.get('id');
            if(id==null || id==0){
                id=1;
            }
            if(id==1) throw new MessageCodeError('drop:table:ById1');
           // let classifyVM:ClassifyCurdVm=new ClassifyCurdVm();
            classifyVM.useFor=useFor;
            classifyVM.deleteClassify=id;
            //let result=this.sitemapService.classifyCurd(classifyVM);
           // let result;
          /*  if(useFor=='art'){
                result=this.classifyService.deleteMethodFirst(id);
            }else if(useFor=='page'){
                result=this.classifyService.deleteMethodSecond(id);
            }*/
            //return result;
        }
        let mobileTheClassify=map.get('mobileTheClassify');
        if(mobileTheClassify!=null || mobileTheClassify !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(mobileTheClassify);
            let useFor:string=amap.get('useFor');
            let id:number=amap.get('id');
            let parentId:number=amap.get('parentId');
            if(parentId==null || parentId==0){
                parentId=1;
            }
            //let classifyVM:ClassifyCurdVm=new ClassifyCurdVm();
            classifyVM.useFor=useFor;
            classifyVM.mobileClassifyId={id:id,parentId:parentId};
            //let result=this.sitemapService.classifyCurd(classifyVM);

        }
        this.sitemapService.classifyCurd(classifyVM);
        let result;
        if(classifyVM.useFor=='art'){
            result=this.classifyService.findAllClassifyArt(1);
        }else if(classifyVM.useFor=='page'){
            result=this.classifyService.findAllClassifyPage(1);
        }
        return result;
          //return result;

    }
    @Mutation()
    async PageCUD(obj,arg) {
        const str: string = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        let PageReturn:Page[];
        let pagination;
        let createPages = map.get('createPages');
        let createParam:CreatePageVm=new CreatePageVm();
        let resultPage;
        if (createPages != null || createPages != undefined) {
            let amap = new Map();
            amap = this.objToStrMap(createPages);
            let page:PageEntity=new PageEntity();
            page.title=amap.get('title');
            page.alias=amap.get('alias');
            page.classify=amap.get('classify');
            page.classifyId=amap.get('classifyId');
            let contents:PageContentEntity[]=[];
            let strFinal:string[]=amap.get('content');
            for(let t in strFinal){
                let newContent:PageContentEntity=new PageContentEntity;
                newContent.content=strFinal[t];
                contents.push(newContent);
            }
            createParam.page=page;
            createParam.content=contents;
            createParam.limit=amap.get('limitNum');
            createParam.pages=amap.get('pages');

            //let resultPage= await this.pageService.createPages(page,contents,amap.get('limitNum'),amap.get('pages')).then(a=>{return a});
          /*  PageReturn=await this.classifyService.TimestampPage(resultPage.pages);
            pagination=await this.classifyService.pageServiceArt(resultPage.totalItems,amap.get('limitNum'),amap.get('pages'));*/
        }
        let updatePages=map.get('updatePages');
        if(updatePages != null || updatePages != undefined){
            let amap = new Map();
            amap = this.objToStrMap(updatePages);
            let page:PageEntity=new PageEntity();
            page.id=amap.get('id');
            page.title=amap.get('title');
            page.alias=amap.get('alias');
            page.classify=amap.get('classify');
            page.classifyId=amap.get('classifyId');
            let contents:PageContentEntity[]=[];
            let strFinal:ContentMap[]=amap.get('content');
            for(let t in strFinal){
                let newContent:PageContentEntity=new PageContentEntity;
                newContent.content=strFinal[t].content;
                newContent.id=strFinal[t].id;
                contents.push(newContent);
            }
            createParam.page=page;
            createParam.content=contents;
            createParam.limit=amap.get('limitNum');
            createParam.pages=amap.get('pages');
            //let resultPage=await this.pageService.updatePages(page,contents,amap.get('limitNum'),amap.get('pages')).then(a=>{return a});
           /* PageReturn=await this.classifyService.TimestampPage(resultPage.pages);
            pagination=await this.classifyService.pageServiceArt(resultPage.totalItems,amap.get('limitNum'),amap.get('pages'));*/

        }
        let deletePages=map.get('deletePages');
        if(deletePages != null || deletePages != undefined) {
            let amap = new Map();
            amap = this.objToStrMap(deletePages);
            let array:[number]=amap.get('id');
            createParam.limit=amap.get('limitNum');
            createParam.pages=amap.get('pages');
            createParam.array=array;

           // let resultPage=await this.pageService.deletePages(array,amap.get('limitNum'),amap.get('pages')).then(a=>{return a});

        }
        this.sitemapService.pageCurd(createParam).then(a=>{console.log('执行时间='+new Date().getTime())});
        let returnValue=await this.pageService.getAllPage(createParam.limit,createParam.pages);
        PageReturn=await this.classifyService.TimestampPage(returnValue.pages);
        pagination=await this.classifyService.pageServiceArt(returnValue.totalItems,createParam.limit,createParam.pages);
        return{pagination:pagination,pages:PageReturn};
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