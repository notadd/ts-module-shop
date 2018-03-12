import {Mutation, Resolver} from "@nestjs/graphql";
import {RegistrationService} from "./registration.service";
import {Query} from "@nestjs/common";
import {BlockEntity} from "../entity/block.entity";
import {SiteEntity} from "../entity/site.entity";
import {VisitEntity} from "../entity/visit.entity";

@Resolver('Enter')
export class EnterResolver {
    constructor(private readonly registration:RegistrationService){}

    @Query('getAllVisits')
    async getAllVisits(obj,arg){
        const str: string = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        let limit:number=map.get('limit');
        const result=await this.registration.getVisit(map.get('limit'),map.get('pages'));
        return result;
    }

    @Query('getAllSites')
    async getAllSites(obj,arg){
        const str: string = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        const result=await this.registration.getSite(map.get('limit'),map.get('pages'));
        return result;
    }

    @Query('getAllBlocks')
    async getAllBlocks(obj,arg){
        const str: string = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        const result=await this.registration.getAllBlocks(map.get('limit'),map.get('pages'));
        return result;
    }

    @Mutation('createBlocks')
    async createBlocks(obj,arg){
        const str: string = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        let block:BlockEntity=map.get('block');
        const result=await this.registration.createBlock(block);
        return result;
    }

    @Mutation('createSites')
    async createSites(obj,arg){
        const str: string = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        let site:SiteEntity=map.get('site');
        const result=await this.registration.createSite(site);
        return result;
    }

    @Mutation('createVisits')
    async createVisits(obj,arg){
        const str: string = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        let visit:VisitEntity=map.get('visit');
        const result=await this.registration.createVisit(visit);
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