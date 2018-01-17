import {Component, Inject} from "@nestjs/common";
import {getManager, Repository} from "typeorm";
import {ArticleEntity} from "../entity/article.entity";

@Component()
export class ArticleService{
constructor(@Inject('ArticleRepositoryToken') private readonly respository:Repository<ArticleEntity>){}

    /**
     * 返回所有数据,依据提供limit number 进行分页
     * @returns {Promise<ArticleEntity[]>}
     */
    async  getArticleAll(limit:number):Promise<ArticleEntity[]>{
        let resultAll:ArticleEntity[]= await this.respository.createQueryBuilder().orderBy('article.id',"ASC").limit(limit).getMany();
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
        console.log('字符串拼接=='+str);
        let resultAll:ArticleEntity[]=await this.respository.createQueryBuilder().where('"name"like :name',{name:str,}).limit(limit).orderBy('article.id','ASC').getMany();
        return resultAll;
    }
}