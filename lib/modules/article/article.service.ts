import {Component, Inject} from "@nestjs/common";
import { Repository} from "typeorm";
import {ArticleEntity} from "../entity/article.entity";
import {MessageCodeError} from "../errorMessage/error.interface";
import {HistoryEntity} from "../entity/history.entity";
import {HistoryService} from "../history/history.service";
import {ClassifyService} from "../classify/classify.service";
import {PageClassifyEntity} from "../entity/pageClassify.entity";
import {ClassifyEntity} from "../entity/classify.entity";

@Component()
export class ArticleService{
constructor(@Inject('ArticleRepositoryToken') private readonly respository:Repository<ArticleEntity>,
            private readonly historyService:HistoryService,
            private readonly classifyService:ClassifyService){}

    /**
     * 返回所有数据,依据提供limit number 进行分页
     * @returns {Promise<ArticleEntity[]>}
     */
    async  getArticleAll(limit:number):Promise<ArticleEntity[]>{
        let resultAll:ArticleEntity[]= await this.respository.createQueryBuilder().where('"recycling"<> :recycling or recycling isnull  and hidden=false',{recycling:true}).orderBy('id',"ASC").limit(limit).getMany();
        return resultAll;
    }

    /**
     * 全局搜索
     * @param {string} name
     * @param {number} limit
     * @returns {Promise<ArticleEntity[]>}
     */
    async serachArticles(name:string,limit:number):Promise<ArticleEntity[]>{
        let str:string=`%${name}%`;
        let resultAll:ArticleEntity[]=await this.respository.createQueryBuilder().where('"name"like :name',{name:str,}).orderBy('id','ASC').limit(limit).getMany();
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
      async createArticle(article:ArticleEntity):Promise<ArticleEntity[]>{
        let entity:ClassifyEntity=await this.classifyService.findOneByIdArt(article.classifyId);
        if(article.classifyId!=null && article.classifyId!=0 && entity==null) throw new MessageCodeError('page:classify:classifyIdMissing');
        if(article.publishedTime<new Date()) throw new MessageCodeError('create:publishedTime:lessThan');
        if(article.classifyId==0 ||article.classifyId==null)
            article.classifyId=null;
          console.log('输入时间='+article.publishedTime);
          this.respository.insert(article);
         return this.getArticleAll(0);
      }

    /**
     * 修改文章
     * @param {ArticleEntity} article
     * @returns {Promise<void>}
     */
      async updateArticle(article:ArticleEntity):Promise<ArticleEntity[]>{
          let art:ArticleEntity =await this.respository.findOneById(article.id);
          if(art==null) throw new MessageCodeError('delete:recycling:idMissing');
          let entity:ClassifyEntity=await this.classifyService.findOneByIdArt(article.classifyId);
          if(article.classifyId!=null && article.classifyId!=0 && entity==null) throw new MessageCodeError('page:classify:classifyIdMissing');
          let time =new Date();
          article.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
          let newArt:ArticleEntity =art;
          this.respository.updateById(newArt.id,newArt);
          return this.getArticleAll(0);
      }

    /**
     * 分页获取回收站内所有文章
     * @param {number} limit
     * @returns {Promise<ArticleEntity[]>}
     */
      async recycleFind(limit:number):Promise<ArticleEntity[]>{
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
    async reductionArticle(array:[number]):Promise<ArticleEntity[]>{
        for(let t in array){
            let article:ArticleEntity=await this.respository.findOneById(array[t]);
            if(article==null) throw new MessageCodeError('delete:recycling:idMissing');
            article.recycling=false;
            let time =new Date();
            article.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
            let newArticle:ArticleEntity=article;
            this.respository.updateById(newArticle.id,newArticle);
        }
        return this.recycleFind(0);
    }

    /**
     * 分批获取置顶文章
     * @param {number} limit
     * @returns {Promise<ArticleEntity[]>}
     */
    async findTopPlace(limit:number):Promise<ArticleEntity[]>{
        let result:ArticleEntity[]=await this.respository.createQueryBuilder().where('"topPlace"= :topPlace',{topPlace:'global'}).orderBy('id','ASC').limit(limit).getMany();
        return result;
    }

}