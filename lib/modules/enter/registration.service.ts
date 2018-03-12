import {Component, Inject} from "@nestjs/common";
import {Repository} from "typeorm";
import {BlockEntity} from "../entity/block.entity";
import {SiteEntity} from "../entity/site.entity";
import {VisitEntity} from "../entity/visit.entity";

@Component()
export class RegistrationService{
   constructor(@Inject('BlockRepositoryToken') private readonly blockRespository:Repository<BlockEntity>,
               @Inject('fieldRepositoryToken') private readonly  siteRespository:Repository<SiteEntity>,
               @Inject('VisitRepositoryToken') private readonly visitRespository:Repository<VisitEntity>){}
       //街区入驻
       async createBlock(block:BlockEntity){
        await this.blockRespository.save(block);
       }
       //场地租用
       async createSite(site:SiteEntity){
       await this.siteRespository.save(site);
       }
       //参观预约
       async createVisit(visit:VisitEntity){
       await this.visitRespository.save(visit);
       }
       //获取街区入驻信息
       async getAllBlocks(limit?:number,pages?:number){
           const  result=await this.blockRespository.createQueryBuilder().orderBy('"id"','ASC').skip(limit*(pages-1)).take(limit).getManyAndCount();
           console.log(result);
           return result;
       }
       //获取场地租用信息
       async getSite(limit?:number,pages?:number){
           const  result=await this.siteRespository.createQueryBuilder().orderBy('"id"','ASC').skip(limit*(pages-1)).take(limit).getManyAndCount();
           console.log(result);
           return result;
       }
       //获取参观预约信息
       async getVisit(limit?:number,pages?:number){
           const  result=await this.visitRespository.createQueryBuilder().orderBy('"id"','ASC').skip(limit*(pages-1)).take(limit).getManyAndCount();
           console.log(result);
           return result;
       }

}