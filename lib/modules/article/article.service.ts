import {Component, Inject} from "@nestjs/common";
import { Repository} from "typeorm";
import {ArticleEntity} from "../entity/article.entity";
import {MessageCodeError} from "../errorMessage/error.interface";
import {HistoryEntity} from "../entity/history.entity";
import {HistoryService} from "../history/history.service";
import {ClassifyService} from "../classify/classify.service";
import {ClassifyEntity} from "../entity/classify.entity";

@Component()
export class ArticleService{
constructor(@Inject('ArticleRepositoryToken') private readonly respository:Repository<ArticleEntity>,
            private readonly historyService:HistoryService,
            private readonly classifyService:ClassifyService,){}

    /**
     * 返回所有数据,依据提供limit进行分页
     * @returns {Promise<ArticleEntity[]>}
     */
    async  getArticleAll(limit?:number,hidden?:boolean):Promise<ArticleEntity[]>{
        let resultAll:ArticleEntity[]=[];
        if(hidden==true){
            let newArray:ArticleEntity[]=[];
            let newresult:ArticleEntity[] = await this.respository.createQueryBuilder().where('"recycling"<> :recycling or recycling isnull and hidden=true',{recycling:true}).orderBy('id',"ASC").limit(limit).getMany();
            for(let t in newresult){
                if(newresult[t].hidden){
                    newArray.push(newresult[t]);
                }
            }
            resultAll.push(...newArray);
        }else if(hidden==false){
            console.log('false='+hidden);
            let newresult:ArticleEntity[] = await this.respository.createQueryBuilder().where('"recycling"<> :recycling or recycling isnull and hidden=false',{recycling:true}).orderBy('id',"ASC").limit(limit).getMany();
            resultAll.push(...newresult);
        }else if(hidden==undefined){
            console.log('undefined='+hidden);
            let newresult:ArticleEntity[] = await this.respository.createQueryBuilder().where('"recycling"<> :recycling or recycling isnull',{recycling:true}).orderBy('id',"ASC").limit(limit).getMany();
            resultAll.push(...newresult);
        }
        return resultAll;
    }

    /**
     * 全局搜索
     * @param {string} name
     * @param {number} limit
     * @returns {Promise<ArticleEntity[]>}
     */
    async serachArticles(name:string,limit?:number):Promise<ArticleEntity[]>{
        let str:string=`%${name}%`;
        let resultAll:ArticleEntity[]=await this.respository.createQueryBuilder().where('"name"like :name',{name:str,}).andWhere('"recycling"<> :recycling or recycling isnull',{recycling:true}).orderBy('id','ASC').limit(limit).getMany();
        return resultAll;
    }

    /**
     * 修改数据状态为回收站
     * @param {[number]} array
     * @returns {Promise<number>}
     */
     async deleteArticles(array:[number]):Promise<number>{
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
        let levelGive:string=article.topPlace.toString();
        if(level=='level1' && levelGive=='level2' || levelGive=='level3') throw new MessageCodeError('create:level:lessThanLevel');
        if(level=='level2' && levelGive=='level3') throw new MessageCodeError('create:level:lessThanLevel');
        if(article.classifyId==0 ||article.classifyId==null)
            article.classifyId=await this.classifyService.findTheDefaultByAlias('默认分类','art');
            article.classify='默认分类';
         let create:number=await this.respository.createQueryBuilder().insert().into(ArticleEntity).values(article).output('id').execute().then(a=>{return a});
         return create;
      }

    /**
     * 修改文章
     * @param {ArticleEntity} article
     * @returns {Promise<void>}
     */
      async updateArticle(article:ArticleEntity):Promise<number>{
          let art:ArticleEntity =await this.respository.findOneById(article.id);
          if(art==null) throw new MessageCodeError('delete:recycling:idMissing');
          let entity:ClassifyEntity=await this.classifyService.findOneByIdArt(article.classifyId);
          if(article.classifyId!=null && article.classifyId!=0 && entity==null) throw new MessageCodeError('page:classify:classifyIdMissing');
          if(article.classifyId==0 ||article.classifyId==null)
            article.classifyId=await this.classifyService.findTheDefaultByAlias('默认分类','art');
            article.classify='默认分类';
        let num:number=await this.classifyService.findLevel(article.classifyId);
          let level:string=this.classifyService.interfaceChange(num);
          let levelGive:string=article.topPlace.toString();
          if(level=='level1' && levelGive=='level2' || levelGive=='level3') throw new MessageCodeError('create:level:lessThanLevel');
          if(level=='level2' && levelGive=='level3') throw new MessageCodeError('create:level:lessThanLevel');
          let time =new Date();
          article.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
          let newArt:ArticleEntity =article;
          let result=await this.respository.createQueryBuilder().update(ArticleEntity).set(newArt).where('"id"= :id',{id:newArt.id}).output('id').execute().then(a=>{return a});
          return result;
      }

    /**
     * 分页获取回收站内所有文章
     * @param {number} limit
     * @returns {Promise<ArticleEntity[]>}
     */
      async recycleFind(limit?:number):Promise<ArticleEntity[]>{
          let result:ArticleEntity[]=await this.respository.createQueryBuilder().where('"recycling"= :recycling',{recycling:true}).limit(limit).getMany();
          return result;
      }

    /**
     * 回收站内删除数据，记入历史表
     * @param {[number]} array
     * @returns {Promise<number>}
     */
    async recycleDelete(array:[number]):Promise<number>{
        let count:number=0;
        let history:HistoryEntity[] =[];
        for(let t in array){
            let article:ArticleEntity=await this.respository.findOneById(array[t]);
            if(article==null) throw new MessageCodeError('delete:recycling:idMissing');
            let id:number=article.id;
            let his:HistoryEntity =new HistoryEntity();
            his.articleId =id;
            his.articleName =article.name;
            this.respository.deleteById(id);
            count++;
            history.push(his);
        }
        this.historyService.createHistory(history);
        return count;
    }

    /**
     * 回收站内批量或者单个还原数据，目前限制分页为0
     * @param {[number]} array
     * @returns {Promise<ArticleEntity[]>}
     */
    async reductionArticle(array:[number]):Promise<number>{
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
        return num;
    }

    /**
     * 分批获取置顶文章
     * @param {number} limit
     * @returns {Promise<ArticleEntity[]>}
     */
    async findTopPlace(limit?:number):Promise<ArticleEntity[]>{
        let result:ArticleEntity[]=await this.respository.createQueryBuilder().where('"topPlace"= :topPlace',{topPlace:'global'}).orderBy('"updateAt"','ASC').limit(limit).getMany();
        return result;
    }

    /**
     * 回收站内根据分类查找文章
     * @param {number} id
     * @param {number} limit
     * @returns {Promise<ArticleEntity[]>}
     */
    async reductionClassity(id:number,limit?:number):Promise<ArticleEntity[]>{
        let result:ArticleEntity[]=await this.respository.createQueryBuilder().where('"classifyId"= :classifyId  and recycling=true',{classifyId:id}).orderBy('id','ASC').limit(limit).getMany();
        return result;
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
            article.topPlace=`global,current`;
        }else if(level=='level2'){
            article.topPlace=`global,level1,current`;
        }else if(level=='level3'){
            article.topPlace=`global,level1,current,level2`;
        }else{
            article.topPlace=`global,level1,,level2,level3,current`;
        }
        let newArticle:ArticleEntity=article;
        Array.push(newArticle);
        return Array;
    }

}