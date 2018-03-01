import {Component, HttpException, Inject} from "@nestjs/common";
import {getManager, Repository} from "typeorm";
import {ArticleEntity} from "../entity/article.entity";
import {MessageCodeError} from "../errorMessage/error.interface";
import {HistoryEntity} from "../entity/history.entity";
import {HistoryService} from "../history/history.service";
import {ClassifyService} from "../classify/classify.service";
import {ClassifyEntity} from "../entity/classify.entity";
import {PageClassifyEntity} from "../entity/pageClassify.entity";
import {PagerService} from "../database/common.paging";

@Component()
export class ArticleService{
constructor(@Inject('ArticleRepositoryToken') private readonly respository:Repository<ArticleEntity>,
            //private readonly historyService:HistoryService,
            private readonly classifyService:ClassifyService){}

    /**
     * 返回所有数据,依据提供limit进行分页
     * @returns {Promise<ArticleEntity[]>}
     */
    async  getArticleAll(limit?:number,hidden?:boolean,pages?:number){
        let title:number=0;
        let resultAll:ArticleEntity[]=[];
        if(hidden==true){
            let newArray:ArticleEntity[]=[];
            let newresult:ArticleEntity[] = await this.respository.createQueryBuilder().where('"recycling"<> :recycling and hidden=true',{recycling:true}).orderBy('id',"ASC").skip(limit*(pages-1)).take(limit).getMany();
            for(let t in newresult){
                if(newresult[t].hidden){
                    newArray.push(newresult[t]);
                }
            }
            title= await this.respository.createQueryBuilder().where('"recycling"<> :recycling and hidden=true',{recycling:true}).getCount();
            resultAll.push(...newArray);
        }
        if(hidden==false){
            console.log('false='+hidden);
            let newresult:ArticleEntity[] = await this.respository.createQueryBuilder().where('"recycling"<> :recycling  and hidden=false',{recycling:true}).orderBy('id',"ASC").skip(limit*(pages-1)).take(limit).getMany();
            title=await this.respository.createQueryBuilder().where('"recycling"<> :recycling and hidden=false',{recycling:true}).getCount();
            resultAll.push(...newresult);
        }
        if(hidden==undefined){
            console.log('undefined='+hidden);
            let newresult:ArticleEntity[] = await this.respository.createQueryBuilder().where('"recycling"<> :recycling',{recycling:true}).orderBy('id',"ASC").skip(limit*(pages-1)).take(limit).getMany();
            title=await this.respository.createQueryBuilder().where('"recycling"<> :recycling or recycling isnull',{recycling:true}).getCount();
            resultAll.push(...newresult);
        }
        return {articles:resultAll,totalItems:title};
    }

    /**
     * 全局搜索
     * @param {string} name
     * @param {number} limit
     * @returns {Promise<ArticleEntity[]>}
     */
    async serachArticles(name:string,limit?:number,pages?:number){
        let str:string=`%${name}%`;
        let resultAll:ArticleEntity[]=await this.respository.createQueryBuilder().where('"name"like :name',{name:str,}).andWhere('"recycling"<> :recycling or recycling isnull',{recycling:true}).orderBy('id','ASC').skip(limit*(pages-1)).take(limit).getMany();
        let title:number=await this.respository.createQueryBuilder().where('"name"like :name',{name:str,}).andWhere('"recycling"<> :recycling or recycling isnull',{recycling:true}).getCount();
        return {articles:resultAll,totalItems:title};
    }

    /**
     * 修改数据状态为回收站
     * @param {[number]} array
     * @returns {Promise<number>}
     */
     async deleteArticles(array:number[]):Promise<number>{
        let count:number=0;
        for(let t in array){
            let article:ArticleEntity=await this.respository.findOneById(array[t]);
            if(article==null) throw new MessageCodeError('delete:recycling:idMissing');
            article.recycling=true;
            let time =new Date();
            article.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
            let newArticle:ArticleEntity=article;
            this.respository.updateById(newArticle.id,newArticle);
            count++;
        }
        return count;
      }

    /**
     * 添加文章
     * @param {ArticleEntity} article
     * @returns {Promise<void>}
     */
      async createArticle(article:ArticleEntity){
        let entity:ClassifyEntity=await this.classifyService.findOneByIdArt(article.classifyId);
        if(article.classifyId!=null && article.classifyId!=0 && entity==null) throw new MessageCodeError('page:classify:classifyIdMissing');
        if(article.publishedTime<new Date()) throw new MessageCodeError('create:publishedTime:lessThan');
        let num:number=await this.classifyService.findLevel(article.classifyId);
        let level:string=this.classifyService.interfaceChange(num);
        if(article.topPlace==null){
            article.topPlace='cancel';
        }
        let levelGive:string=article.topPlace.toString();
        if(level=='level1' && levelGive=='level2' || levelGive=='level3') throw new MessageCodeError('create:level:lessThanLevel');
        if(level=='level2' && levelGive=='level3') throw new MessageCodeError('create:level:lessThanLevel');
        if(article.classifyId==0 ||article.classifyId==null)
            article.classifyId=await this.classifyService.findTheDefaultByAlias('默认分类','art');
            article.classify='默认分类';
        let time =new Date();
        if(article.publishedTime==null){
            article.publishedTime=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
        }
        article.recycling=false;
        let create:number=await this.respository.createQueryBuilder().insert().into(ArticleEntity).values(article).output('id').execute().then(a=>{return a});
         return create;
      }

    /**
     * 修改文章
     * @param {ArticleEntity} article
     * @returns {Promise<void>}
     */
      async updateArticle(article:ArticleEntity){
          let art:ArticleEntity =await this.respository.findOneById(article.id);
          if(art==null) throw new MessageCodeError('delete:recycling:idMissing');
          let entity:ClassifyEntity=await this.classifyService.findOneByIdArt(article.classifyId);
          if(article.classifyId!=null && article.classifyId!=0 && entity==null) throw new MessageCodeError('page:classify:classifyIdMissing');
          if(article.classifyId==0 ||article.classifyId==null)
            article.classifyId=await this.classifyService.findTheDefaultByAlias('默认分类','art');
            article.classify='默认分类';
          let num:number=await this.classifyService.findLevel(article.classifyId);
          let level:string=this.classifyService.interfaceChange(num);
          let levelGive:string=article.topPlace;
        if(level=='level1' && levelGive=='level2' || levelGive=='level3') throw new MessageCodeError('create:level:lessThanLevel');
          if(level=='level2' && levelGive=='level3') throw new MessageCodeError('create:level:lessThanLevel');
          let time =new Date();
          article.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
          let newArt:ArticleEntity =article;
          await this.respository.updateById(newArt.id,newArt);
         // let result=await this.respository.createQueryBuilder().update(ArticleEntity).set(newArt).where('"id"= :id',{id:newArt.id}).output('id').execute().then(a=>{return a});
          //return result;
      }

    /**
     * 分页获取回收站内所有文章
     * @param {number} limit
     * @returns {Promise<ArticleEntity[]>}
     */
      async recycleFind(limit?:number,pages?:number){
          let result:ArticleEntity[]=await this.respository.createQueryBuilder().where('"recycling"= :recycling',{recycling:true}).orderBy('id','ASC').skip(limit*(pages-1)).take(limit).getMany();
          let title:number=await this.respository.createQueryBuilder().where('"recycling"= :recycling',{recycling:true}).getCount();
          return {articles:result,totalItems:title};
      }

    /**
     * 回收站内删除数据，记入历史表
     * @param {[number]} array
     * @returns {Promise<number>}
     */
    async recycleDelete(array:number[]){
        let result;
        try{
             result=await this.respository.createQueryBuilder().delete()
                 .from(ArticleEntity).whereInIds(array)
                 .output('id').execute()
                 .then(a=>{return a});
        }catch (err){
            throw new HttpException('删除错误'+err.toString(),401);
        }
        return result;
    }

    /**
     * 回收站内批量或者单个还原数据，目前限制分页为0
     * @param {[number]} array
     * @returns {Promise<ArticleEntity[]>}
     */
    async reductionArticle(array:number[]):Promise<number>{
        let num:number=0;
        for(let t in array){
            let article:ArticleEntity=await this.respository.findOneById(array[t]);
            if(article==null) throw new MessageCodeError('delete:recycling:idMissing');
            article.recycling=false;
            let time =new Date();
            article.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
            let newArticle:ArticleEntity=article;
            this.respository.updateById(newArticle.id,newArticle);
            num++;

        }
        //批量修改的方法
        //await this.respository.createQueryBuilder().update().set(ArticleEntity).whereInIds(array).output('id').execute();
        return num;
    }

    /**
     * 分批获取置顶文章
     * @param {number} limit
     * @returns {Promise<ArticleEntity[]>}
     */
    async findTopPlace(limit?:number,pages?:number){
        let result:ArticleEntity[]=await this.respository.createQueryBuilder().where('"topPlace"= :topPlace',{topPlace:'global'}).orderBy('"updateAt"','ASC').skip(limit*(pages-1)).take(limit).getMany();
        let title:number=await this.respository.createQueryBuilder().where('"topPlace"= :topPlace',{topPlace:'global'}).getCount();
        return {articles:result,totalItems:title};
    }

    /**
     * 回收站内根据分类查找当前分类及子分类下的文章
     * @param {number} id
     * @param {number} limit
     * @returns {Promise<ArticleEntity[]>}
     */
    async reductionClassity(id:number,limit?:number,pages?:number){
        let entity:ClassifyEntity=await this.classifyService.findOneByIdArt(id);
        if(entity==null) throw new MessageCodeError('page:classify:classifyIdMissing');
        let array:number[]=await this.classifyService.getClassifyId(id).then(a=>{return a});
        array.push(id);
        let newArray:number[]=Array.from(new Set(array));
        let result:ArticleEntity[]=await this.respository.createQueryBuilder().where('"classifyId" in (:classifyId)  and recycling=true',{classifyId:newArray}).orderBy('id','ASC').skip(limit*(pages-1)).take(limit).getMany();
        let title:number=await this.respository.createQueryBuilder().where('"classifyId" in (:classifyId)  and recycling=true',{classifyId:newArray}).getCount();
        return {articles:result,totalItems:title}
    }

    /**
     * 根据id获取文章
     * @param {number} id
     * @returns {Promise<ArticleEntity>}
     */
    async getArticleById(id:number):Promise<ArticleEntity[]>{
        let Array:ArticleEntity[]=[];
        let article:ArticleEntity=await this.respository.findOneById(id);
        if(article==null) throw new MessageCodeError('delete:recycling:idMissing');
        let parent:ClassifyEntity=await this.classifyService.findOneByIdArt(article.classifyId);
        if(parent==null) throw new MessageCodeError('delete:recycling:idMissing');
        let num:number=await this.classifyService.findLevel(article.classifyId).then(a=>{return a});
        let level:string=this.classifyService.interfaceChange(num);
        if(level=='level1'){
            article.topPlace=`cancel,global,current`;
        }else if(level=='level2'){
            article.topPlace=`cancel,global,level1,current`;
        }else if(level=='level3'){
            article.topPlace=`cancel,global,level1,current,level2`;
        }else{
            article.topPlace=`cancel,global,level1,level2,level3,current`;
        }
        let newArticle:ArticleEntity=article;
        Array.push(newArticle);
        return Array;
    }

    /**
     * 根据分类id获取层级
     * @param {number} id
     * @returns {Promise<string>}
     */
    async getLevelByClassifyId(id:number):Promise<string>{
        let entity:ClassifyEntity=await this.classifyService.findOneByIdArt(id);
        if(entity==null) throw new MessageCodeError('delete:recycling:idMissing');
        let num:number=await this.classifyService.findLevel(entity.id).then(a=>{return a});
        let level:string=this.classifyService.interfaceChange(num);
        let topPlace:string='';
        if(level=='level1'){
            topPlace=`global,current`;
        }else if(level=='level2'){
           topPlace=`global,level1,current`;
        }else if(level=='level3'){
            topPlace=`global,level1,current,level2`;
        }else{
            topPlace=`global,level1,level2,level3,current`;
        }
        return topPlace;
    }

}