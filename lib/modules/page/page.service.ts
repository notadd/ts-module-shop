import {Component, Inject} from "@nestjs/common";
import {Repository} from "typeorm";
import {PageEntity} from "../entity/page.entity";
import {HistoryService} from "../history/history.service";
import {HistoryEntity} from "../entity/history.entity";
import {MessageCodeError} from "../errorMessage/error.interface";
import {PageClassifyEntity} from "../entity/pageClassify.entity";
import {ClassifyService} from "../classify/classify.service";
import {PageContentEntity} from "../entity/page.content.entity";

@Component()
export class PageService{
    constructor(@Inject('PageRepositoryToken') private readonly repository:Repository<PageEntity>,
                private readonly historyService:HistoryService,
                private readonly classifyService:ClassifyService,
                @Inject('ContentRepositoryToken') private readonly contentRepository:Repository<PageContentEntity>) {}

    /**
     * 获取所有页面
     * @returns {Promise<PageEntity[]>}
     */
    async getAllPage(limit:number):Promise<PageEntity[]>{
        let pages:PageEntity[]=await this.repository.createQueryBuilder().orderBy('id',"ASC").limit(limit).getMany();
        return pages;
    }

    /**
     * 根据页面名称搜索
     * @param {string} keywords
     * @returns {Promise<PageEntity[]>}
     */
    async serachKeywords(keywords:string):Promise<PageEntity[]>{
        let words=`%${keywords}%`;
        console.log('page的关键字'+words);
        let pages:PageEntity[]=await this.repository.createQueryBuilder().where('"title"like :title',{title:words}).orderBy('id','ASC').getMany();
        return pages;
    }
    /**
     * 批量或者单个删除页面
     * @param {number[]} array
     * @returns {Promise<number>}
     */
    async deletePages(array:number[]):Promise<number>{
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
        return deleteNum;
    }

    /**
     * 新增页面,暂时不能确定别名是否可以重复
     * @param {PageEntity} page
     * @returns {Promise<PageEntity[]>}
     */
    async createPages(page:PageEntity,contents:PageContentEntity[]):Promise<PageEntity[]>{
        if(page.title==null) throw new MessageCodeError('create:page:missingTitle');
        if(page.alias==null) throw new MessageCodeError('create:page:missingAlias');
        let entity:PageClassifyEntity=await this.classifyService.findOneByIdPage(page.classify);
        if(page.classify!=null && page.classify!=0 && entity==null) throw new MessageCodeError('page:classify:classifyIdMissing');
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
        return this.getAllPage(0);
    }
    /**
     * 修改页面,暂时不能确定别名是否可以重复
     * @param {PageEntity} page
     * @returns {Promise<PageEntity[]>}
     */
    async updatePages(page:PageEntity,content:PageContentEntity[]):Promise<PageEntity[]>{
        if(page.id==null) throw new MessageCodeError('delete:page:deleteById');
        if(page.title==null) throw new MessageCodeError('create:page:missingTitle');
        if(page.alias==null) throw new MessageCodeError('create:page:missingAlias');
        let aliasEntity:PageEntity[]=await this.repository.createQueryBuilder().where('"alias"= :alias',{alias:page.alias}).getMany();
        if(aliasEntity.length>0) throw new MessageCodeError('create:classify:aliasRepeat');
        let entity:PageClassifyEntity=await this.classifyService.findOneByIdPage(page.classify);
        if(page.classify!=null && page.classify!=0 && entity==null) throw new MessageCodeError('page:classify:classifyIdMissing');
        let time =new Date();
        page.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
        let newPage:PageEntity =page;
        this.repository.updateById(page.id,newPage);
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
        return this.getAllPage(0);
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
        return entity;
    }

    /**
     * 通过分类id查找页面
     * @param {number} id
     * @param {number} limit
     * @returns {Promise<PageEntity[]>}
     */
    async findPageByClassifyId(id:number,limit:number):Promise<PageEntity[]>{
        let entityClassify:PageClassifyEntity=await this.classifyService.findOnePageClassifyById(id);
        if(entityClassify==null) throw new MessageCodeError('delete:page:deleteById');
        let entity:PageEntity[]=await this.repository.createQueryBuilder().where('"classify"= :classify',{classify:id}).orderBy('id','ASC').limit(limit).getMany();
        return entity;
    }
}