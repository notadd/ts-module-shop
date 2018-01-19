import {Component, Inject} from "@nestjs/common";
import {Repository} from "typeorm";
import {PageEntity} from "../entity/page.entity";
import {HistoryService} from "../history/history.service";
import {HistoryEntity} from "../entity/history.entity";
import {MessageCodeError} from "../errorMessage/error.interface";

@Component()
export class PageService{
    constructor(@Inject('PageRepositoryToken') private readonly repository:Repository<PageEntity>,
                private readonly historyService:HistoryService){}

    /**
     * 获取所有页面
     * @returns {Promise<PageEntity[]>}
     */
    async getAllPage():Promise<PageEntity[]>{
        let pages:PageEntity[]=await this.repository.find();
        return;
    }

    /**
     * 根据页面名称搜索
     * @param {string} keywords
     * @returns {Promise<PageEntity[]>}
     */
    async serachKeywords(keywords:string):Promise<PageEntity[]>{
        let words=`%${keywords}%`;
        console.log('page的关键字'+words);
        let pages:PageEntity[]=await this.repository.createQueryBuilder().where('"title"like :title',{title:words}).orderBy('page.id','ASC').getMany();
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
    async createPages(page:PageEntity):Promise<PageEntity[]>{
        if(page.title==null) throw new MessageCodeError('create:page:missingTitle');
        if(page.alias==null) throw new MessageCodeError('create:page:missingAlias');
        this.repository.insert(page);
        return this.getAllPage();
    }
}