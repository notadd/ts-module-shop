import { Mutation, Query, Resolver } from "@nestjs/graphql";
import { ArticleEntity } from "../entity/article.entity";
import { ClassifyService } from "./service/classify.service";
import { PageEntity } from "../entity/page.entity";
import { PageContentEntity } from "../entity/page.content.entity";
import { MessageCodeError } from "./errorMessage/error.interface";
import { CreateXmlVm } from "./models/view/create-xml-vm";
import { CqrsService } from "./cqrs.service";
import { CreatePageVm } from "./models/view/create-page.vm";
import { GetPageVm } from "./models/view/get-page.vm";
import { ClassifyCurdVm } from "./models/view/classify-curd.vm";
import { ArticleCurdVm } from "./models/view/article-curd.vm";
import { ContentMap } from "./common/param.dto";
import { PagerService } from "../export/common.paging";

@Resolver()
export class CqrsResolver{
    constructor(
                private readonly classifyService:ClassifyService,
                private readonly sitemapService:CqrsService,
                private readonly pagerService:PagerService){}

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
        return result;
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
        const result=this.sitemapService.updateXml();
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
        let result:ArticleEntity[];
        let getArticle=map.get('getArticleAll');
        let articleVM:ArticleCurdVm=new ArticleCurdVm();
        if(getArticle!=null || getArticle!=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getArticle);
            articleVM.getArticles={getArticleAll:true,hidden:amap.get('hidden')};
            articleVM.limitNum=amap.get('limitNum');
            articleVM.pages=amap.get('pages');
        }
        let recycleFind=map.get('recycleFind');
        if(recycleFind!=null || recycleFind !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(recycleFind);
            articleVM.getArticles={recycleFind:true};
            articleVM.limitNum=amap.get('limitNum');
            articleVM.pages=amap.get('pages');
        }
        let reductionGetByClassifyId=map.get('reductionGetByClassifyId');
        if(reductionGetByClassifyId!=null || reductionGetByClassifyId !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(reductionGetByClassifyId);
            articleVM.getArticles={reductionGetByClassifyId:amap.get('id')};
            articleVM.limitNum=amap.get('limitNum');
            articleVM.pages=amap.get('pages');
        }
        let findTopPlace=map.get('findTopPlace');
        if(findTopPlace!=null || findTopPlace !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(findTopPlace);
            articleVM.getArticles={findTopPlace:true};
            articleVM.limitNum=amap.get('limitNum');
            articleVM.pages=amap.get('pages');
        }
        let serachArticle=map.get('serachArticle');
        if(serachArticle !=null || serachArticle != undefined){
            let amap=new Map();
            amap=this.objToStrMap(serachArticle);
            let keyWords:string=amap.get('keyWords');
            let limitNum:number=amap.get('limitNum');
            let pages:number=amap.get('pages');
            let groupId:number=amap.get('classifyId');
            let findTop:boolean=amap.get('topPlace');
            if(!keyWords) keyWords="";
            articleVM.getArticles={getArticleByClassifyId:{classifyId:groupId,top:findTop,name:keyWords}};
            articleVM.limitNum=limitNum;
            articleVM.pages=pages;
        }
        let keywordSearch=map.get('keywordSearch');
        if(keywordSearch !=null || keywordSearch !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(keywordSearch);
            let keyWords:string=amap.get('keyWords');
            articleVM.getArticles={keywordSearch:keyWords};
            articleVM.limitNum=amap.get('limitNum');
            articleVM.pages=amap.get('pages');
        }
        articleVM.getAllArticles=true;
        let resultArt=await this.sitemapService.articleCurd(articleVM);
        const paging= this.pagerService.getPager(resultArt.totalItems,articleVM.pages,articleVM.limitNum);
        result=await this.classifyService.TimestampArt(resultArt.articles);
        return {pagination:paging,articles:result};

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
        let result:ArticleEntity[];
        if(showNext!=null || showNext !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(showNext);
            articleVM.getArticles={showNext:amap.get('id')};
        }
        let getArticleById=map.get('getArticleById');
        if(getArticleById!=null || getArticleById !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getArticleById);
            articleVM.getArticles={getArticleById:amap.get('id')};
        }
        let superiorArticle=map.get('superiorArticle');
        if(superiorArticle!=null || superiorArticle !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(superiorArticle);
            articleVM.getArticles={superiorArticle:amap.get('id')};
        }
        let getCurrentClassifyArticles=map.get('getCurrentClassifyArticles');
        if(getCurrentClassifyArticles!=null || getCurrentClassifyArticles !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getCurrentClassifyArticles);
            articleVM.getArticles={getCurrentClassifyArticles:amap.get('id')};
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
        let entity=await this.sitemapService.articleCurd(articleVM);
        result=await this.classifyService.TimestampArt(entity.articles);
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
        let result;
        let classifyVM:ClassifyCurdVm=new ClassifyCurdVm();
        let getAllClassify=map.get('getAllClassify');
        if(getAllClassify!=null || getAllClassify !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getAllClassify);
            let useFor:string=amap.get('useFor');
            let id:number=amap.get('id');
            if(id==null || id==0){
                id=1;
            }
            classifyVM.useFor=useFor;
            classifyVM.getAllClassify=true;
        }
        result=this.sitemapService.getClassify(classifyVM);
        return result;
    }
    @Query()
   async getClassifyById(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let result;
        let classifyVM:ClassifyCurdVm=new ClassifyCurdVm();
        let getClassifyById=map.get('getClassifyById');
        if(getClassifyById!=null || getClassifyById !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getClassifyById);
            let useFor:string=amap.get('useFor');
            let id:number=amap.get('id');
            if(id==null || id==0){
                id=1;
            }
            classifyVM.getClassifyById={useFor:useFor,id:id};
        }
        result=await this.sitemapService.getClassify(classifyVM);
        return result;
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
        let getAllPage=map.get('getAllPage');
        let pageParam:GetPageVm=new GetPageVm();
        if(getAllPage!=null || getAllPage !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getAllPage);
            pageParam.getAll=true;
            pageParam.limit=amap.get('limitNum');
            pageParam.pages=amap.get('pages');
        }
        let serachPages=map.get('serachPages');
        if(serachPages!=null || serachPages !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(serachPages);
            pageParam.keywords=amap.get('keywords');
            pageParam.limit=amap.get('limitNum');
            pageParam.pages=amap.get('pages');
        }
        let getPagesByClassifyId=map.get('getPagesByClassifyId');
        if(getPagesByClassifyId!=null || getPagesByClassifyId !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getPagesByClassifyId);
            pageParam.classifyId=amap.get('id');
            pageParam.limit=amap.get('limitNum');
            pageParam.pages=amap.get('pages');
        }
        let resultPage=await this.sitemapService.getPages(pageParam).then(a=>{return a});
        const paging= this.pagerService.getPager(resultPage.totalItems,pageParam.pages,pageParam.limit);
        return{pagination:paging,pages:resultPage.pages};
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
            pageParam.id=amap.get('id');
            const result=this.sitemapService.getPages(pageParam);
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
            if(art.publishedTime){
                let date:string=art.publishedTime.toString();
                art.publishedTime=new Date(Date.parse(date.replace(/- /g,"/")));
            }else{
                art.publishedTime=null;
            }
            if(art.endTime){
                let endTime:string=art.endTime.toString();
                art.endTime=new Date(Date.parse(endTime.replace(/- /g,"/")));
            }
            if(art.startTime){
                let startTime:string=art.startTime.toString();
                art.startTime=new Date(Date.parse(startTime.replace(/- /g,"/")))
            }
            let newArt=new Map();
            newArt=this.objToStrMap(createArt);
            let amap =new Map();
            let newArticle:ArticleEntity=art;
            articleVM.createArticle={article:newArticle};
        }
        let updateArt=map.get('updateArt');
        if(updateArt!=null || updateArt !=undefined){
            let art:ArticleEntity=updateArt;
            if(art.publishedTime){
                let date:string=art.publishedTime.toString();
                art.publishedTime=new Date(Date.parse(date.replace(/- /g,"/")));
            }
            if(art.startTime){
                let startTime:string=art.startTime.toString();
                art.startTime=new Date(Date.parse(startTime.replace(/- /g,"/")))
            }
            if(art.endTime) {
                let endTime: string = art.endTime.toString();
                art.endTime=new Date(Date.parse(endTime.replace(/- /g,"/")));
            }
            let newArticle:ArticleEntity=art;
            let ws=new Map();
            ws.set('obj',obj);
            let newArt=new Map();
            newArt=this.objToStrMap(updateArt);
            let amap =new Map();
            articleVM.updateArticle={article:newArticle}

        }
        let deleteById=map.get('deleteById');
        if(deleteById!=null || deleteById !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(deleteById);
            let array:[number]=amap.get('id');
            articleVM.deleteById=array;
        }
        let recycleDelete=map.get('recycleDelete');
        if(recycleDelete!=null || recycleDelete !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(recycleDelete);
            let array:[number]=amap.get('id');
            articleVM.recycleDelete=array;
        }
        let reductionArticle=map.get('reductionArticle');
        if(reductionArticle!=null || reductionArticle !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(reductionArticle);
            let array:[number]=amap.get('id');
            articleVM.reductionArticle=array;
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
        let pictureUpload = map.get('pictureUpload');
        if(pictureUpload != null || pictureUpload != undefined){
            let amap=new Map();
            amap=this.objToStrMap(pictureUpload);
            let ws=new Map();
            ws.set('obj',obj);
            articleVM.pictureUpload={bucketName:amap.get('bucketName'),
                rawName:amap.get('rawName'),
                base64:amap.get('base64'),
                url:ws,
                id:amap.get('id')};
        }
        const result=await this.sitemapService.articleCurd(articleVM);
        return JSON.stringify(result);
    }

    /**
     * 分类的增加、修改 分文章和页面两种
     * @param obj
     * @param arg
     * @returns {any}
     * @constructor
     */
    @Mutation()
    async ClassifyCU(obj,arg){
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
            let id:number=amap.get('id');
            if(id==null || id==0){
                id=1;
            }
            classifyVM.useFor=useFor;
            if(useFor=="art"){
                classifyVM.createClassify={art:amap.get('createClass')};
            }
            if(useFor=='page'){
                classifyVM.createClassify={page:amap.get('createClass')};
            }
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
            classifyVM.useFor=useFor;
            if(useFor=="art"){
                classifyVM.updateClassify={art:amap.get('updateClass')};
            }
            if(useFor=='page'){
                classifyVM.updateClassify={page:amap.get('updateClass')};
            }
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
            classifyVM.useFor=useFor;
            classifyVM.deleteClassify=id;
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
            classifyVM.useFor=useFor;
            classifyVM.mobileClassifyId={id:id,parentId:parentId};
        }
        const  result=await this.sitemapService.classifyCurd(classifyVM);
        return JSON.stringify(result);
    }
    @Mutation()
    async PageCUD(obj,arg) {
        const str: string = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        let createPages = map.get('createPages');
        let createParam:CreatePageVm=new CreatePageVm();
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
                let amap = new Map();
                amap=this.objToStrMap(strFinal[t]);
                newContent.content=amap.get('content');
                newContent.id=amap.get('id');
                contents.push(newContent);
            }
            createParam.page=page;
            createParam.content=contents;
            createParam.limit=amap.get('limitNum');
            createParam.pages=amap.get('pages');
        }
        let deletePages=map.get('deletePages');
        if(deletePages != null || deletePages != undefined) {
            let amap = new Map();
            amap = this.objToStrMap(deletePages);
            let array:[number]=amap.get('id');
            createParam.limit=amap.get('limitNum');
            createParam.pages=amap.get('pages');
            createParam.array=array;
        }
        const result=await this.sitemapService.pageCurd(createParam);
        return JSON.stringify(result);
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