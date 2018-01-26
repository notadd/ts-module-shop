import {Component, Inject} from "@nestjs/common";
import {Repository} from "typeorm";
import {ClassifyEntity} from "../entity/classify.entity";
import {MessageCodeError} from "../errorMessage/error.interface";
import {getManager} from "typeorm";
import {ArticleEntity} from "../entity/article.entity";
import {PageClassifyEntity} from "../entity/pageClassify.entity";
import {PageEntity} from "../entity/page.entity";
import {async} from "rxjs/scheduler/async";
import {createYield} from "typescript";
import {isNumber} from "util";

@Component()
export class ClassifyService{
    constructor(@Inject('ClassifyRepositoryToken') private readonly repository:Repository<ClassifyEntity>,
                @Inject('ArticleRepositoryToken') private readonly artRepository:Repository<ArticleEntity>,
                @Inject('PageClassifyRepositoryToken') private readonly pageRepository:Repository<PageClassifyEntity>,
                @Inject('PageRepositoryToken') private readonly repositoryPage:Repository<PageEntity>){}

    /**
     * 新增文章分类
     * @param {ClassifyEntity} entity
     * @param {string} parent
     * @returns {Promise<ClassifyEntity[]>}
     */
    async createClassifyArt(entity:ClassifyEntity):Promise<ClassifyEntity[]>{
            let newClassify:ClassifyEntity[] = await this.repository.createQueryBuilder().where('"classifyAlias"= :classifyAlias',{classifyAlias:-entity.classifyAlias}).getMany();
            //别名不能重复
            if(newClassify.length>0) throw new MessageCodeError('create:classify:aliasRepeat');
            let parentClassify:ClassifyEntity = await this.repository.findOneById(entity.groupId);
            //通过父级别名确定父级是否存在
            if(entity.groupId!=0 && entity.groupId!=null && parentClassify==null) throw new MessageCodeError('create:classify:parentIdMissing');
            let first:ClassifyEntity=await this.repository.findOneById(1);
            if(entity.groupId==0 && first==null){
                entity.groupId=null;
            }else if(entity.groupId==0){
                entity.groupId=1;
            }
            let classify:ClassifyEntity=entity;
            await this.repository.insert(classify);
            return this.findAllClassifyArt(1);
    }

    /**
     * 新增页面分类
     * @param {PageClassifyEntity} entity
     * @returns {Promise<PageClassifyEntity[]>}
     */
    async createClassifyPage(entity:PageClassifyEntity):Promise<PageClassifyEntity[]>{
        let newClassify:PageClassifyEntity[] = await this.pageRepository.createQueryBuilder().where('"classifyAlias"= :classifyAlias',{classifyAlias:-entity.classifyAlias}).getMany();
        //别名不能重复
        if(newClassify.length>0) throw new MessageCodeError('create:classify:aliasRepeat');
        let parentClassify:PageClassifyEntity = await this.pageRepository.findOneById(entity.groupId);
        //通过父级别名确定父级是否存在
        if(entity.groupId!=0 && entity.groupId!=null && parentClassify==null) throw new MessageCodeError('create:classify:parentIdMissing');
        let first:PageClassifyEntity=await this.pageRepository.findOneById(1);
        if(entity.groupId==0 && first==null){
            entity.groupId=null;
        }else if(entity.groupId==0){
            entity.groupId=1;
        }
        let classify:PageClassifyEntity=entity;
        await this.pageRepository.insert(classify);
        return this.findAllClassifyPage(1);
    }

    /**
     * 修改文章分类
     * @param {ClassifyEntity} entity
     * @returns {Promise<ClassifyEntity[]>}
     */
    async updateClassifyArt(entity:ClassifyEntity):Promise<ClassifyEntity[]>{
            //当前Id是否存在
            let classify:ClassifyEntity = await this.repository.findOneById(entity.id);
            if(classify==null) throw new MessageCodeError('update:classify:updateById');
            let newClassify:ClassifyEntity[] = await this.repository.createQueryBuilder().where('"classifyAlias"= :classifyAlias',{classifyAlias:entity.classifyAlias}).getMany();
            //别名不能重复
            if(newClassify.length>0) throw new MessageCodeError('create:classify:aliasRepeat');
            let parentClassify:ClassifyEntity = await this.repository.findOneById(entity.groupId);
            //通过父级别名确定父级是否存在
            if(parentClassify==null) throw new MessageCodeError('create:classify:parentIdMissing');
            let time =new Date();
            entity.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
            let finalClassify:ClassifyEntity =entity;
            await this.repository.updateById(entity.id,finalClassify);
            return this.findAllClassifyArt(1);
     }

    /**
     * 修改页面分类
     * @param {PageClassifyEntity} entity
     * @returns {Promise<PageClassifyEntity[]>}
     */
     async updateClassifyPage(entity:PageClassifyEntity):Promise<PageClassifyEntity[]>{
         let classify:PageClassifyEntity = await this.pageRepository.findOneById(entity.id);
         if(classify==null) throw new MessageCodeError('update:classify:updateById');
         let newClassify:PageClassifyEntity[] = await this.pageRepository.createQueryBuilder().where('"classifyAlias"= :classifyAlias',{classifyAlias:entity.classifyAlias}).getMany();
         //别名不能重复
         if(newClassify.length>0) throw new MessageCodeError('create:classify:aliasRepeat');
         let parentClassify:PageClassifyEntity = await this.pageRepository.findOneById(entity.groupId);
         //通过父级别名确定父级是否存在
         if(parentClassify==null) throw new MessageCodeError('create:classify:parentIdMissing');
         let time =new Date();
         entity.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
         let finalClassify:PageClassifyEntity =entity;
         await this.pageRepository.updateById(entity.id,finalClassify);
         return this.findAllClassifyPage(1);
     }

    /**
     * 查找文章所有分类
     * @param {number} id
     * @returns {Promise<ClassifyEntity[]>}
     */
    async findAllClassifyArt(id:number):Promise<ClassifyEntity[]>{
        let list:ClassifyEntity[]=await this.repository.createQueryBuilder().where('"groupId"= :id',{id:id,}).orderBy('id','ASC').getMany();
        let idFindOne:ClassifyEntity =await this.repository.createQueryBuilder().where('"id"= :id',{id:id,}).getOne();
        let result:ClassifyEntity[]=[];
        let resultArray:ClassifyEntity[]=await this.Artrecursion(id,list);
        idFindOne.childrens=resultArray;
        let newPageClassify:ClassifyEntity=idFindOne;
        result.push(newPageClassify);
        return result;
    }

    /**
     * 查找页面所有分类
     * @returns {Promise<PageClassifyEntity[]>}
     */
    async findAllClassifyPage(id:number):Promise<PageClassifyEntity[]>{
        let list:PageClassifyEntity[]=await this.pageRepository.createQueryBuilder().where('"groupId"= :id',{id:id,}).orderBy('id','ASC').getMany();
        let idFindOne:PageClassifyEntity =await this.pageRepository.createQueryBuilder().where('"id"= :id',{id:id,}).getOne();
        let result:PageClassifyEntity[]=[];
        let resultArray:PageClassifyEntity[]=await this.Pagerecursion(id,list);
        idFindOne.childrens=resultArray;
        let newPageClassify:PageClassifyEntity=idFindOne;
        result.push(newPageClassify);
        return result;
    }

    /**
     * 页面无极限分类
     * @param {ClassifyEntity[]} entity
     * @returns {Promise<ClassifyEntity[]>}
     */
    async Pagerecursion(id:number,listFirst:PageClassifyEntity[]):Promise<PageClassifyEntity[]>{
        let children:PageClassifyEntity[]=[];
        for(let t in listFirst){
            let groupIdFirst:number=listFirst[t].id;
            let navigationArray=new PageClassifyEntity;
            navigationArray=listFirst[t];
            let listSecond:PageClassifyEntity[]=await this.pageRepository.createQueryBuilder().where('"groupId"= :id',{id:groupIdFirst,}).orderBy('id','ASC').getMany();
            if(listSecond.length>0){
                for(let h in listSecond){
                    let theEnd:PageClassifyEntity[]= await this.Pagerecursion(listSecond[h].id,listSecond);
                    navigationArray.childrens =theEnd;
                }
            }else{
                navigationArray.childrens=null;
            }
            let navigationFinal:PageClassifyEntity=navigationArray;
            children.push(navigationFinal);
        }
        return children;
    }

    /**
     *文章无极限分类
     * @param {number} id
     * @param {ClassifyEntity[]} listFirst
     * @returns {Promise<ClassifyEntity[]>}
     * @constructor
     */
    async Artrecursion(id:number,listFirst:ClassifyEntity[]):Promise<ClassifyEntity[]>{
        let children:ClassifyEntity[]=[];
        for(let t in listFirst){
            let groupIdFirst:number=listFirst[t].id;
            let navigationArray=new ClassifyEntity;
            navigationArray=listFirst[t];
            let listSecond:ClassifyEntity[]=await this.repository.createQueryBuilder().where('"groupId"= :id',{id:groupIdFirst,}).orderBy('id','ASC').getMany();
            if(listSecond.length>0){
                for(let h in listSecond){
                    let theEnd:ClassifyEntity[]= await this.Artrecursion(listSecond[h].id,listSecond);
                    navigationArray.childrens =theEnd;
                }
            }else{
                navigationArray.childrens=null;
            }
            let navigationFinal:ClassifyEntity=navigationArray;
            children.push(navigationFinal);
        }
        return children;
    }
    /**
     * 通过Id删除文章分类及对应的子分类
     * @param {number} id
     * @returns {Promise<ClassifyEntity[]>}
     */
    async deleteClassifyArt(id:number,result:ClassifyEntity[]):Promise<number[]>{
        let deleteArray:number[]=[];
            for (let t in result){
                let num = result[t].id;
                if(num==id){
                    deleteArray.push(id);
                    let array:ClassifyEntity[]= result[t].childrens;
                    if(array.length>0){
                        for(let h in array){
                            let numH = array[h].id;
                            console.log('numH='+numH);
                            deleteArray.push(numH);
                            await this.repository.deleteById(numH);
                            await this.deleteClassifyArt(numH,result);
                        }
                    }
                    await this.repository.deleteById(num);
                }
            }
            if(deleteArray.length==0){
                deleteArray.push(id);
            }
            this.updateArticleClassify(deleteArray,'art');
            await this.repository.deleteById(id);
            return deleteArray;

    }
    async deleteMethodFirst(id:number){
        await getManager().query("update public.article_classify_table set \"parentId\" = \"groupId\"");
        const result =await this.repository.createQueryBuilder('article_classify_table').innerJoinAndSelect('article_classify_table.childrens','childrens').orderBy('article_classify_table.id').getMany();
        let resultArray:ClassifyEntity[]=result;
        await getManager().query("update public.article_classify_table set \"parentId\"=null");
        let res:number[]=await this.deleteClassifyArt(id,result);
        return this.findAllClassifyArt(1);
    }
    /**
     * 通过id删除页面分类及对应的子分类
     * @param {number} id
     * @returns {Promise<PageClassifyEntity[]>}
     */
    async deleteMethodSecond(id:number):Promise<PageClassifyEntity[]>{
        let classify:PageClassifyEntity = await this.pageRepository.findOneById(id);
        if(classify==null) throw new MessageCodeError('update:classify:updateById');
        await getManager().query("update public.page_classify_table set \"parentId\" = \"groupId\"");
        const result =await this.pageRepository.createQueryBuilder('page_classify_table').innerJoinAndSelect('page_classify_table.childrens','childrens').orderBy('page_classify_table.id').getMany();
        let resultArray:PageClassifyEntity[]=result;
        let res:number[]=await this.deleteClassifyPage(id,result);
        return this.findAllClassifyPage(1);
    }

    /**
     * 页面删除分类
     * @param {number} id
     * @param {PageClassifyEntity[]} result
     * @returns {Promise<number[]>}
     */
    async deleteClassifyPage(id:number,result:PageClassifyEntity[]):Promise<number[]>{
        let deleteArray:number[]=[];
        for (let t in result){
            let num = result[t].id;
            if(num==id){
                deleteArray.push(id);
                let array:PageClassifyEntity[]= result[t].childrens;
                if(array.length>0){
                    for(let h in array){
                        let numH = array[h].id;
                        console.log('numH='+numH);
                        deleteArray.push(numH);
                        await this.pageRepository.deleteById(numH);
                        await this.deleteClassifyPage(numH,result);
                    }
                }
                await this.pageRepository.deleteById(num);
            }
        }
        if(deleteArray.length==0){
            deleteArray.push(id);
        }
        this.updateArticleClassify(deleteArray,'page');
        await this.pageRepository.deleteById(id);
        return deleteArray;
    }
    /**
     * 删除分类后，修改文章状态为默认分类。需要新建一个分类为默认
     * @param {number[]} classifyArray
     * @returns {Promise<void>}
     */
    async updateArticleClassify(classifyArray:number[],useFor:string){
        if(useFor=='art'){
            for(let t in classifyArray){
                let article:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"classifyId"= :classifyId',{classifyId:classifyArray[t]}).getMany();
                for(let h in article){
                    let newArticle:ArticleEntity=article[h];
                    newArticle.classifyId=null;
                    newArticle.classify=null;
                    let time =new Date();
                    newArticle.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
                    this.artRepository.updateById(newArticle.id,newArticle);
                }
            }
        }else if(useFor=='page'){
            for(let t in classifyArray){
                let article:PageEntity[]=await this.repositoryPage.createQueryBuilder().where('"classifyId"= :classifyId',{classifyId:classifyArray[t]}).getMany();
                for(let h in article){
                    let newArticle:PageEntity=article[h];
                    newArticle.classify=null;
                    let time =new Date();
                    newArticle.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
                    this.repositoryPage.updateById(newArticle.id,newArticle);
                }
            }
        }
    }

    /**
     * 根据id查找文章分类
     * @param {number} id
     * @param {string} useFor
     * @returns {Promise<ClassifyEntity>}
     */
    async findOneByIdArt(id:number):Promise<ClassifyEntity>{
        let entity:ClassifyEntity =await this.repository.findOneById(id);
        return entity;
    }

    /**
     * 根据id查找页面分类
     * @param {number} id
     * @returns {Promise<PageClassifyEntity>}
     */
    async findOneByIdPage(id:number):Promise<PageClassifyEntity>{
        let entity:PageClassifyEntity=await this.pageRepository.findOneById(id);
        return entity;
    }
    //let global:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"topPlace"= :topPlace',{topPlace:'Level1'}).orderBy('id','ASC').getMany();

    /**
     * 显示子级分类文章
     * @param {number} id
     * @returns {Promise<ArticleEntity[]>}
     */
    async showNextTitle(id:number):Promise<ArticleEntity[]>{
        let articles:ArticleEntity[]=[];
        let arrayNum:number[] = [];
        let classifications:ClassifyEntity[]=await this.repository.createQueryBuilder().where('"groupId"= :groupId',{groupId:id}).getMany();
        for(let t in classifications){
            arrayNum.push(classifications[t].id);
        }
        for(let h in arrayNum){
            let art:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"classifyId"= :classifyId',{classifyId:arrayNum[h]}).orderBy('id','ASC').getMany();
            articles.push(...art);
        }
        return articles;
    }

    /**
     * 通过分类id获取文章
     * @param {number} id
     */
    async getArticelsByClassifyId(id:number):Promise<ArticleEntity[]>{
        let article:ArticleEntity[]=[];
        await getManager().query("update public.article_classify_table set \"parentId\" = \"groupId\"");
        let classify:ClassifyEntity[]=await this.repository.createQueryBuilder('article_classify_table').innerJoinAndSelect('article_classify_table.childrens','childrens').orderBy('article_classify_table.id').getMany();
        console.log('数组='+this.findLevel(classify,id,0));
      /*   let num:number=await this.showClassifyLevel(classify,id,0).then( a=>{console.log('级别是'+a)});
        console.log('级别是'+num);
        if(id==1){
          let global:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"topPlace"= :topPlace',{topPlace:'global'}).orderBy('id','ASC').getMany();
          article.push(...global);
            let articel:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"classifyId"= :classifyId and "topPlace"<>\'global\'',{classifyId:1}).orderBy('id','ASC').getMany();
            article.push(...article);
        }
        const num= new Promise((resolve ) =>{ this.showClassifyLevel(id,0)});
        let num:number=await this.showClassifyLevel(id,0);
        console.log('cehis='+JSON.stringify(num));
        let array:ClassifyEntity[]=await this.showClassifyLevel(id,0);
        let num:number=this.modifyLevel(array);
        console.log('num='+num);*/
        return article;
    }
    public findLevel(arr:ClassifyEntity[],id:number,level){
        //let finalArray:ClassifyEntity[]=[];
        for(let t in arr){
            if(arr[t].groupId==id && arr[t].groupId!=null){
              //  arr[t].level=level;
               // finalArray.push(arr[t]);
                this.findLevel(arr,arr[t].groupId,level+1);
            }
        }
        return //finalArray;
    }

    /**
     * 找出分类级别
     * @param {number} ids
     * @returns {Promise<number>}
     */
    public async showClassifyLevel(/*arr:ClassifyEntity[],*/id:number,level:number){
        let array:ClassifyEntity[]=[];
        let first:ClassifyEntity=await this.repository.findOneById(id);
        if(first!=null){
           // console.log('id='+id+'level='+level);
            first.level=level;
            let second:ClassifyEntity[]=await this.showClassifyLevel(first.groupId,level+1);
            first.childrens=second;

        }
        array.push(first);
       // console.log('n='+JSON.stringify(array));
        return array;

        /*for(let t in arr){
            let classify:ClassifyEntity[]=arr[t].childrens;
            for(let h in classify){
                if(classify[h].id==id){
                    levelNum=level;
                    console.log('levelNum='+levelNum+',id='+classify[h].id);
                    await this.showClassifyLevel(arr, classify[h].groupId,level+1);
                    return levelNum;
                }
            }
        }*/

    }
    public  modifyLevel(arr:ClassifyEntity[]):number{
        for(let t in arr){
            if(arr[t].id!=1){
                 this.modifyLevel(arr[t].childrens)
            }else if(arr[t].id==1){
                let levelNum:number=arr[t].level;
                console.log('levelnum='+levelNum);
                return levelNum;
            }
        }
    }

    /**
     *文章分类移动
     * @param {string} useFor
     * @param {number} id
     * @param {number} groupId
     * @returns {Promise<ClassifyEntity[]>}
     */
    public async mobileClassifyArt(id:number,groupId:number):Promise<ClassifyEntity[]>{
        let classify:ClassifyEntity = await this.repository.findOneById(id);
        if(classify==null) throw new MessageCodeError('update:classify:updateById');
        if(groupId!=0){
            let parent:ClassifyEntity =await this.repository.findOneById(groupId);
            if(parent==null) throw new MessageCodeError('update:classify:updateById');
        }
        if(groupId==0){
            groupId=1;
        }
        classify.groupId=groupId;
        let time =new Date();
        classify.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
        let newClassify:ClassifyEntity=classify;
        this.repository.updateById(newClassify.id,newClassify);
        return this.findAllClassifyArt(1);

    }
    /**
     * 页面分类移动
     * @param {number} id
     * @param {number} groupId
     * @returns {Promise<PageClassifyEntity[]>}
     */
    public async mobileClassifyPage(id:number,groupId:number):Promise<PageClassifyEntity[]>{
        let classify:PageClassifyEntity = await this.pageRepository.findOneById(id);
        if(classify==null) throw new MessageCodeError('update:classify:updateById');
        if(groupId!=0){
            let parent:PageClassifyEntity =await this.pageRepository.findOneById(groupId);
            if(parent==null) throw new MessageCodeError('update:classify:updateById');
        }
        if(groupId==0){
            groupId=1;
        }
        classify.groupId=groupId;
        let time =new Date();
        classify.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
        let newClassify:PageClassifyEntity=classify;
        this.pageRepository.updateById(newClassify.id,newClassify);
        return this.findAllClassifyPage(1);
    }
}
