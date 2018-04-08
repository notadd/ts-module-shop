import {Component} from "@nestjs/common";
import {Repository} from "typeorm";
import {BlockEntity} from "../entity/block.entity";
import {SiteEntity} from "../entity/site.entity";
import {VisitEntity} from "../entity/visit.entity";
import {PagerService, ReturnPage} from "../export/common.paging";
import {InjectRepository} from "@nestjs/typeorm";

@Component()
export class RegistrationService{
   constructor(@InjectRepository(BlockEntity) private readonly blockRespository:Repository<BlockEntity>,
               @InjectRepository(SiteEntity) private readonly  siteRespository:Repository<SiteEntity>,
               @InjectRepository(VisitEntity) private readonly visitRespository:Repository<VisitEntity>){}
       //街区入驻
       async createBlock(block:BlockEntity){
       let message:string;
       let code:number;
       try{
           block.collapse=false;
           await this.blockRespository.save(block);
           message="添加成功";code=200;
       }catch (err){
           message="添加失败";code=500;
       }
         return{MessageCodeError:message,Code:code}
       }
       //场地租用
       async createSite(site:SiteEntity){
            let message:string;
            let code:number;
            let time:Date=site.startTime;
            site.startTime=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
            let newTime:Date=site.endTime;
            site.endTime=new Date(newTime.getTime()-newTime.getTimezoneOffset()*60*1000);
            try{
                site.collapse=false;
                await this.siteRespository.save(site);
                message="添加成功";code=200;
            }catch (err){
                message="添加失败";code=500;
            }
           return{MessageCodeError:message,Code:code}
       }
       //参观预约
       async createVisit(visit:VisitEntity){
           let message:string;
           let code:number;
           try {
               visit.collapse=false;
               await this.visitRespository.save(visit);
               message="添加成功";code=200;
           }catch (err){
               message="添加失败";code=500;
           }
           return{MessageCodeError:message,Code:code}
       }
       //获取街区入驻信息
       async getAllBlocks(limit?:number,pages?:number){
           const  result=await this.blockRespository.createQueryBuilder().orderBy('"id"','ASC').skip(limit*(pages-1)).take(limit).getManyAndCount().then(a=>{return a});
           let str:string=JSON.stringify(result);
           let num:string=str.substring(str.lastIndexOf(',')+1,str.lastIndexOf(']'));
           let block:BlockEntity[]=Array.from(JSON.parse(str.substring(str.indexOf('[')+1,str.lastIndexOf(','))));
           return{blocks:block,totals:Number(num)};
       }
       //获取场地租用信息
       async getSite(limit?:number,pages?:number){
           const  result=await this.siteRespository.createQueryBuilder().orderBy('"id"','ASC').skip(limit*(pages-1)).take(limit).getManyAndCount();
           let str:string=JSON.stringify(result);
           let num:string=str.substring(str.lastIndexOf(',')+1,str.lastIndexOf(']'));
           let site:SiteEntity[]=Array.from(JSON.parse(str.substring(str.indexOf('[')+1,str.lastIndexOf(','))));
           return{sites:site,totals:Number(num)};
       }
       //获取参观预约信息
       async getVisit(limit?:number,pages?:number){
           const  result=await this.visitRespository.createQueryBuilder().orderBy('"id"','ASC').skip(limit*(pages-1)).take(limit).getManyAndCount();
           let str:string=JSON.stringify(result);
           let num:string=str.substring(str.lastIndexOf(',')+1,str.lastIndexOf(']'));
           let visit:VisitEntity[]=Array.from(JSON.parse(str.substring(str.indexOf('[')+1,str.lastIndexOf(','))));
           return{visits:visit,totals:Number(num)};
       }

}