import {Component, Inject} from "@nestjs/common";
import {getManager, Repository} from "typeorm";
import {PageEntity} from "../entity/page.entity";
import {HistoryService} from "../history/history.service";
import {HistoryEntity} from "../entity/history.entity";
import {MessageCodeError} from "../errorMessage/error.interface";
import {PageClassifyEntity} from "../entity/pageClassify.entity";
import {ClassifyService} from "../classify/classify.service";
import {PageContentEntity} from "../entity/page.content.entity";
import {ClassifyEntity} from "../entity/classify.entity";

@Component()
export class PageService{
    constructor(@Inject('PageRepositoryToken') private readonly repository:Repository<PageEntity>,
                private readonly historyService:HistoryService,
                private readonly classifyService:ClassifyService,
                @Inject('ContentRepositoryToken') private readonly contentRepository:Repository<PageContentEntity>,
                @Inject('PageClassifyRepositoryToken') private readonly pageRepository:Repository<PageClassifyEntity>,) {}

    /**
     * 获取所有页面
     * @returns {Promise<PageEntity[]>}
     */
    async getAllPage(limit?:number,page?:number){
        let pages:PageEntity[]=await this.repository.createQueryBuilder().orderBy('id',"ASC").skip(limit*(page-1)).take(limit).getMany();
        let title:number=await this.repository.createQueryBuilder().getCount();
        return {pages:pages,totalItems:title};
    }

    /**
     * 根据页面名称搜索
     * @param {string} keywords
     * @returns {Promise<PageEntity[]>}
     */
    async serachKeywords(keywords:string,limit?:number,page?:number){
        let words=`%${keywords}%`;
        console.log('page的关键字'+words);
        let pages:PageEntity[]=await this.repository.createQueryBuilder().where('"title"like :title',{title:words}).orderBy('id','ASC').skip(limit*(page-1)).take(limit).getMany();
        let title:number=await this.repository.createQueryBuilder().where('"title"like :title',{title:words}).getCount();
        return {pages:pages,totalItems:title};
    }
    /**
     * 批量或者单个删除页面
     * @param {number[]} array
     * @returns {Promise<number>}
     */
    async deletePages(array:number[],limit?:number,page?:number){
        console.log('array='+array);
        let deleteNum:number;
        let hisArray:HistoryEntity[]=[];
        for(let t in array){
            let page:PageEntity = await this.repository.findOneById(array[t]);
            if(page==null) throw new MessageCodeError('delete:page:deleteById');
            await this.contentRepository.createQueryBuilder().delete().from(PageContentEntity).where('"parentId"= :parentId',{parentId:page.id}).execute();
            let history=new HistoryEntity();
            history.articleId =page.id;
            history.articleName =page.title;
            hisArray.push(history);
            deleteNum++;
            this.repository.deleteById(page.id);
        }
        this.historyService.createHistory(hisArray);
        return  this.getAllPage(limit,page);
    }

    /**
     * 新增页面,暂时不能确定别名是否可以重复
     * @param {PageEntity} page
     * @returns {Promise<PageEntity[]>}
     */
    async createPages(page:PageEntity,contents:PageContentEntity[],limit?:number,pages?:number){
        if(page.title==null) throw new MessageCodeError('create:page:missingTitle');
        if(page.alias==null) throw new MessageCodeError('create:page:missingAlias');
        let entity:PageClassifyEntity=await this.classifyService.findOneByIdPage(page.classifyId);
        if(page.classifyId!=null && page.classifyId!=0 && entity==null) throw new MessageCodeError('page:classify:classifyIdMissing');
        let aliasEntity:PageEntity[]=await this.repository.createQueryBuilder().where('"alias"= :alias',{alias:page.alias}).getMany();
        if(aliasEntity.length>0) throw new MessageCodeError('create:classify:aliasRepeat');
        let id:number= await this.repository.createQueryBuilder().insert().into(PageEntity).values(page).output('id').execute();
        const str:string=JSON.stringify(id);
        let newstr:string=str.replace('{','').replace('}','').replace('[','').replace(']','');
        let finalStr:string[]=newstr.replace('"','').replace('"','').split(':');
        let idNum:number=Number(finalStr[1]);
        for(let t in contents){
            let newContent:PageContentEntity=new PageContentEntity();
             newContent=contents[t];
             newContent.parentId=idNum;
            await this.contentRepository.insert(newContent);
        }
       // return this.getAllPage(limit,pages);
    }
    /**
     * 修改页面,别名不可重复
     * @param {PageEntity} page
     * @returns {Promise<PageEntity[]>}
     */
    async updatePages(page:PageEntity,content:PageContentEntity[],limit?:number,pages?:number){
        if(page.id==null) throw new MessageCodeError('delete:page:deleteById');
        let aliasEntity:PageEntity[]=await this.repository.createQueryBuilder().where('"alias"= :alias',{alias:page.alias}).getMany();
        if(aliasEntity.length>0) throw new MessageCodeError('create:classify:aliasRepeat');
        let entity:PageClassifyEntity=await this.classifyService.findOneByIdPage(page.classifyId);
        if(page.classifyId!=null && page.classifyId!=0 && entity==null) throw new MessageCodeError('page:classify:classifyIdMissing');
        let time =new Date();
        page.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
       // console.log('pageservice='+JSON.stringify(page));
        let newPage:PageEntity =page;
       // console.log('newPage='+JSON.stringify(newPage));
        await this.repository.updateById(page.id,newPage).then(a=>{console.log(JSON.stringify(a))});
        for(let t in content){
            if(content[t].id==0){
                let newContent:PageContentEntity=new PageContentEntity();
                newContent=content[t];
                newContent.parentId=page.id;
                await this.contentRepository.insert(newContent);
            }else {
                let newContent:PageContentEntity=new PageContentEntity();
                newContent=content[t];
                newContent.parentId=page.id;
                newContent.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
                await this.contentRepository.updateById(newContent.id,newContent);
            }
        }
        return this.getAllPage(limit,pages);
    }

    /**
     * 根据id查找页面及对应内容
     * @param {number} id
     * @returns {Promise<PageEntity>}
     */
    async findPageById(id:number):Promise<PageEntity>{
        let entity:PageEntity=await this.repository.findOneById(id);
        if(entity==null) throw new MessageCodeError('delete:page:deleteById');
        let children:PageContentEntity[]=await this.contentRepository.createQueryBuilder().where('"parentId"= :parentId',{parentId:entity.id}).orderBy('id','ASC').getMany();
        entity.contents=children;
        entity.classify=await this.pageRepository.createQueryBuilder().where('"id"= :id',{id:entity.classifyId}).getOne().then(a=>{return a.classifyName});
        return entity;
    }

    /**
     * 通过分类id查找页面
     * @param {number} id
     * @param {number} limit
     * @returns {Promise<PageEntity[]>}
     */
    async findPageByClassifyId(id:number,limit?:number,page?:number){
        let entityClassify:PageClassifyEntity=await this.classifyService.findOnePageClassifyById(id);
        if(entityClassify==null) throw new MessageCodeError('delete:page:deleteById');
        let array:number[]=await this.getClassifyId(id).then(a=>{return a});
        array.push(id);
        let newArray:number[]=Array.from(new Set(array));
        let entity:PageEntity[]=await this.repository.createQueryBuilder().where('"classifyId" in (:id)',{id:newArray}).orderBy('id','ASC').skip(limit*(page-1)).take(limit).getMany();
        let title:number=await this.repository.createQueryBuilder().where('"classifyId" in (:id)',{id:newArray}).getCount();
        return {pages:entity,totalItems:title};
    }

    /**
     * 获取子级分类
     * @param {number} id
     * @returns {Promise<number[]>}
     */
    async  getClassifyId(id:number):Promise<number[]>{
        await getManager().query("update public.page_classify_table set \"parentId\" = \"groupId\"");
        const result =await this.pageRepository.createQueryBuilder('page_classify_table').where('page_classify_table.id= :id',{id:id}).innerJoinAndSelect('page_classify_table.childrens','childrens').orderBy('page_classify_table.id').getMany();
        let firstArray:PageClassifyEntity[]=result;
        let array:number[]=[];
        for(let t in firstArray){
            array.push(firstArray[t].id);
            if(firstArray[t].childrens.length>0){
                for(let h in firstArray[t].childrens){
                    array.push(firstArray[t].childrens[h].id);
                    array.push(...await this.getClassifyId(firstArray[t].childrens[h].id));
                }
            }
        }
        return array;
    }
}