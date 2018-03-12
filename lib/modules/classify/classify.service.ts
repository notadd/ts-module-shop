import {Component, Inject} from "@nestjs/common";
import {Repository} from "typeorm";
import {ClassifyEntity} from "../entity/classify.entity";
import {MessageCodeError} from "../errorMessage/error.interface";
import {getManager} from "typeorm";
import {Article, ArticleEntity} from "../entity/article.entity";
import {PageClassifyEntity} from "../entity/pageClassify.entity";
import {Page, PageEntity} from "../entity/page.entity";
import {PagerService, ReturnPage} from "../database/common.paging";
import {isNumber} from "util";

@Component()
export class ClassifyService{
    constructor(@Inject('ClassifyRepositoryToken') private readonly repository:Repository<ClassifyEntity>,
                @Inject('ArticleRepositoryToken') private readonly artRepository:Repository<ArticleEntity>,
                @Inject('PageClassifyRepositoryToken') private readonly pageRepository:Repository<PageClassifyEntity>,
                @Inject('PageRepositoryToken') private readonly repositoryPage:Repository<PageEntity>,
                private readonly pageService:PagerService){}

    /**
     * 新增文章分类
     * @param {ClassifyEntity} entity
     * @param {string} parent
     * @returns {Promise<ClassifyEntity[]>}
     */
    async createClassifyArt(entity:ClassifyEntity,limit?:number):Promise<ClassifyEntity[]>{
        let firstClass:ClassifyEntity[] =await this.repository.find();
        if(firstClass.length=0){
            let newClassify =new ClassifyEntity();
            newClassify.title=entity.title;
            newClassify.classifyAlias=entity.classifyAlias;
            newClassify.groupId=null;
            await this.repository.insert(newClassify);
        }else{
            let newClassify:ClassifyEntity[] = await this.repository.createQueryBuilder().where('"classifyAlias"= :classifyAlias',{classifyAlias:-entity.classifyAlias}).getMany();
            //别名不能重复
            if(newClassify.length>0) throw new MessageCodeError('create:classify:aliasRepeat');
            let parentClassify:ClassifyEntity = await this.repository.findOneById(entity.groupId);
            //通过父级id确定父级是否存在
            if(entity.groupId!=0  && parentClassify==null) throw new MessageCodeError('create:classify:parentIdMissing');
            let first:ClassifyEntity=await this.repository.findOneById(1);
            if(entity.groupId==0 && first==null){
                entity.groupId=null;
            }else if(entity.groupId==0){
                entity.groupId=1;
            }
            let classify:ClassifyEntity=entity;
            await this.repository.insert(classify);
        }
            return this.findAllClassifyArt(limit);
    }

    /**
     * 新增页面分类
     * @param {PageClassifyEntity} entity
     * @returns {Promise<PageClassifyEntity[]>}
     */
    async createClassifyPage(entity:PageClassifyEntity,limit?:number):Promise<PageClassifyEntity[]>{
        let firstClass:PageClassifyEntity[] =await this.pageRepository.find();
        if(firstClass.length=0){
            let newClassify =new PageClassifyEntity();
            newClassify.title=entity.title;
            newClassify.classifyAlias=entity.classifyAlias;
            newClassify.groupId=null;
            await this.pageRepository.insert(newClassify);
        }else {
            let newClassify: PageClassifyEntity[] = await this.pageRepository.createQueryBuilder().where('"classifyAlias"= :classifyAlias', {classifyAlias: -entity.classifyAlias}).getMany();
            //别名不能重复
            if (newClassify.length > 0) throw new MessageCodeError('create:classify:aliasRepeat');
            let parentClassify: PageClassifyEntity = await this.pageRepository.findOneById(entity.groupId);
            //通过父级id确定父级是否存在
            if (entity.groupId != 0 && entity.groupId != null && parentClassify == null) throw new MessageCodeError('create:classify:parentIdMissing');
            let first: PageClassifyEntity = await this.pageRepository.findOneById(1);
            if (entity.groupId == 0 && first == null) {
                entity.groupId = null;
            } else if (entity.groupId == 0) {
                entity.groupId = 1;
            }
            let classify: PageClassifyEntity = entity;
            await this.pageRepository.insert(classify);
        }
        return this.findAllClassifyPage(limit);
    }

    /**
     * 修改文章分类
     * @param {ClassifyEntity} entity
     * @returns {Promise<ClassifyEntity[]>}
     */
    async updateClassifyArt(entity:ClassifyEntity,id?:number):Promise<ClassifyEntity[]>{
            //当前Id是否存在
            let classify:ClassifyEntity = await this.repository.findOneById(entity.id);
            if(classify==null) throw new MessageCodeError('update:classify:updateById');
            let newClassify:ClassifyEntity[] = await this.repository.createQueryBuilder().where('"classifyAlias"= :classifyAlias',{classifyAlias:entity.classifyAlias}).getMany();
            //别名不能重复
            if(newClassify.length>0) throw new MessageCodeError('create:classify:aliasRepeat');
            if(isNumber(entity.groupId)){
                let parentClassify:ClassifyEntity = await this.repository.findOneById(entity.groupId);
                //通过父级别名确定父级是否存在
                if(parentClassify==null) throw new MessageCodeError('create:classify:parentIdMissing');
            }
            let time =new Date();
            entity.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
            let finalClassify:ClassifyEntity =entity;
            await this.repository.updateById(entity.id,finalClassify);
            return this.findAllClassifyArt(id);
     }

    /**
     * 修改页面分类
     * @param {PageClassifyEntity} entity
     * @returns {Promise<PageClassifyEntity[]>}
     */
     async updateClassifyPage(entity:PageClassifyEntity,id?:number):Promise<PageClassifyEntity[]>{
         let classify:PageClassifyEntity = await this.pageRepository.findOneById(entity.id);
         if(classify==null) throw new MessageCodeError('update:classify:updateById');
         let newClassify:PageClassifyEntity[] = await this.pageRepository.createQueryBuilder().where('"classifyAlias"= :classifyAlias',{classifyAlias:entity.classifyAlias}).getMany();
         //别名不能重复
         if(newClassify.length>0) throw new MessageCodeError('create:classify:aliasRepeat');
         if(isNumber(entity.groupId)){
             let parentClassify:PageClassifyEntity = await this.pageRepository.findOneById(entity.groupId);
             //通过父级别名确定父级是否存在
             if(parentClassify==null) throw new MessageCodeError('create:classify:parentIdMissing');
         }
         let time =new Date();
         entity.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
         await this.pageRepository.updateById(entity.id,entity);
         return this.findAllClassifyPage(id);
     }

    /**
     * 查找文章所有分类
     * @param {number} id
     * @returns {Promise<ClassifyEntity[]>}
     */
    async findAllClassifyArt(id:number):Promise<ClassifyEntity[]>{
        let list:ClassifyEntity[]=await this.repository.createQueryBuilder().where('"groupId"= :groupId',{groupId:id,}).orderBy('id','ASC').getMany();
        let idFindOne:ClassifyEntity =await this.repository.createQueryBuilder().where('"id"= :id',{id:id,}).getOne();
        let result:ClassifyEntity[]=[];
        let resultArray:ClassifyEntity[]=await this.Artrecursion(id,list);
        idFindOne.children=resultArray;
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
        idFindOne.children=resultArray;
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
                    navigationArray.children =theEnd;
                }
            }else{
                navigationArray.children=null;
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
                    navigationArray.children =theEnd;
                }
            }else{
                navigationArray.children=null;
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
                    let array:ClassifyEntity[]= result[t].children;
                    if(array.length>0){
                        for(let h in array){
                            let numH = array[h].id;
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
           // this.updateArticleClassify(deleteArray,'art');
            await this.repository.deleteById(id);
            return deleteArray;

    }
    async deleteMethodFirst(id:number){
        let classify:ClassifyEntity = await this.repository.findOneById(id);
        if(classify==null) throw new MessageCodeError('update:classify:updateById');
        await getManager().query("update public.article_classify_table set \"parentId\" = \"groupId\"");
        const result =await this.repository.createQueryBuilder('article_classify_table').innerJoinAndSelect('article_classify_table.children','children').orderBy('article_classify_table.id').getMany();
        let resultArray:ClassifyEntity[]=result;
        await getManager().query("update public.article_classify_table set \"parentId\"=null");
        let array:number[]=await this.getClassifyId(id).then(a=>{return a});
        array.push(id);
        let newArray:number[]=Array.from(new Set(array));
        let artiicles:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"classifyId" in (:id)',{id:newArray}).getMany();
        if(artiicles.length>0) throw new MessageCodeError('delete:art:ClassifyIdIncludeArts');
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
        const result =await this.pageRepository.createQueryBuilder('page_classify_table').innerJoinAndSelect('page_classify_table.children','children').orderBy('page_classify_table.id').getMany();
        await getManager().query("update public.page_classify_table set \"parentId\"=null");
        let array:number[]=await this.getClassifyIdPage(id).then(a=>{return a});
        array.push(id);
        let newArray:number[]=Array.from(new Set(array));
        let artiicles:PageEntity[]=await this.repositoryPage.createQueryBuilder().where('"classifyId" in (:id)',{id:newArray}).getMany();
        if(artiicles.length>0) throw new MessageCodeError('delete:page:ClassifyIdIncludePages');
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
                let array:PageClassifyEntity[]= result[t].children;
                if(array.length>0){
                    for(let h in array){
                        let numH = array[h].id;
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
        //this.updateArticleClassify(deleteArray,'page');
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
                let id:number=await this.findTheDefaultByAlias('默认分类','art');
                for(let h in article){
                    let newArticle:ArticleEntity=article[h];
                    newArticle.classifyId=id;
                    newArticle.classify='默认分类';
                    let time =new Date();
                    newArticle.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
                    this.artRepository.updateById(newArticle.id,newArticle);
                }
            }
        }else if(useFor=='page'){
            for(let t in classifyArray){
                let article:PageEntity[]=await this.repositoryPage.createQueryBuilder().where('"classifyId"= :classifyId',{classifyId:classifyArray[t]}).getMany();
                let id:number=await this.findTheDefaultByAlias('默认分类','page');
                for(let h in article){
                    let newArticle:PageEntity=article[h];
                    newArticle.classify='默认分类';
                    newArticle.classifyId=id;
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

    /**
     * 显示子级分类文章
     * @param {number} id
     * @returns {Promise<ArticleEntity[]>}
     */
    async showNextTitle(id: number) : Promise < ArticleEntity[] > {
        let articles: ArticleEntity[] = [];
        let arrayNum: number[] = [];
        let classifications: ClassifyEntity[] = await this.repository.createQueryBuilder()
            .where('"groupId"= :groupId', {
            groupId: id
        }).getMany();
        for (let t in classifications) {
            arrayNum.push(classifications[t].id);
        }
        for (let h in arrayNum) {
            let art: ArticleEntity[] = await this.artRepository.createQueryBuilder().where('"classifyId"= :classifyId', {
                classifyId: arrayNum[h]
            }).orderBy('id', 'ASC').getMany();
            articles.push(...art);
        }
        return articles;
    }
    /**
     * 显示上级置顶文章
     * @param {number} id
     * @returns {Promise<ArticleEntity[]>}
     */
    async showBeforeTitle(id:number):Promise<ArticleEntity[]>{
        let classify:ClassifyEntity=await this.repository.findOneById(id);
        if(classify==null) throw new MessageCodeError('page:classify:classifyIdMissing');
        let articles:ArticleEntity[]=[];
        let currentArticle:ArticleEntity[]=await this.artRepository.createQueryBuilder().
        where('"classifyId"= :classifyId and "topPlace"=\'current\'',{classifyId:classify.groupId}).orderBy('"updateAt"','ASC').getMany();
        articles.push(...currentArticle);
        let array:number[]=await this.getClassifyId(classify.groupId).then(a=>{return a});
        array.push(id);
        let newArray:number[]=Array.from(new Set(array));
        let finalArray:number[]=[];
        for(let t in newArray){
            if(newArray[t]!=classify.groupId){
                finalArray.push(newArray[t]);
            }
        }
        let level:number=await this.findLevel(classify.groupId);
        if(level==1){
            let newArticles:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"classifyId" in (:id)',{id:newArray}).andWhere('"topPlace"= :topPlace',{topPlace:'level1'}).orderBy('"updateAt"','ASC').getMany();
           console.log('final='+JSON.stringify(newArticles));
            articles.push(...newArticles);
        }else if(level==2){
            let newArticles=await this.artRepository.createQueryBuilder().where('"classifyId" in (:id)',{id:newArray}).andWhere('"topPlace"= :topPlace',{topPlace:'level2'}).orderBy('"updateAt"','ASC').getMany();
            articles.push(...newArticles);
        }else if(level==3){
            let newArticles=await this.artRepository.createQueryBuilder().where('"classifyId" in (:id)',{id:newArray}).andWhere('"topPlace"= :topPlace',{topPlace:'level3'}).orderBy('"updateAt"','ASC').getMany();
            articles.push(...newArticles);
        }
        return articles;
    }

    /**
     * 当前分类文章
     * @param {number} id
     * @returns {Promise<ArticleEntity[]>}
     */
    async showCurrentArticles(id:number):Promise<ArticleEntity[]>{
        let classify:ClassifyEntity=await this.repository.findOneById(id);
        if(classify==null) throw new MessageCodeError('page:classify:classifyIdMissing');
        let articles:ArticleEntity[]=[];
        //let globalArts:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"topPlace"= :topPlace',{topPlace:'global'}).orderBy('"updateAt"','ASC').getMany();
        //let current:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"classifyId"=:id',{id:id}).andWhere('"topPlace"<> :topPlace',{topPlace:'global'}).orderBy('"updateAt"','ASC').getMany();
       //articles.push(...globalArts);
        let current:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"classifyId"=:id',{id:id}).orderBy('"updateAt"','ASC').getMany();
        articles.push(...current);
        return articles;
    }

    /**
     * 通过分类id获取文章(包含置顶)
     * @param {number} id
     */
    async getArticelsByClassifyId(id:number,limit?:number,show?:Boolean,pages?:number,name?:string){
        let str:string=`%${name}%`;
        let articles:ArticleEntity[]=[];
        let entity:ClassifyEntity=await this.findOneByIdArt(id);
        if(entity==null) throw new MessageCodeError('page:classify:classifyIdMissing');
        let level:number=await this.findLevel(entity.id);
        let array:number[]=await this.getClassifyId(id).then(a=>{return a});
        array.push(id);
        let newArray:number[]=Array.from(new Set(array));
        //置顶：无 获取对应关键字或分类 对应的文章,是：获取对应分类下，置顶到1、2 、 3级分类的文章,否：获取对应分类下置顶到4、 5 分类的文章
        if(show==true){
            let global:ArticleEntity[]=[];
            let globalArts:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"topPlace"= :topPlace',{topPlace:'global'}).andWhere('"name"like :name and recycling=false',{name:str}).orderBy('"updateAt"','ASC').getMany();
            for(let t in globalArts){
                if(globalArts[t].display!=null){
                    let newArray:string[]=globalArts[t].display.split(',');
                    let num:number=newArray.indexOf(id.toString());
                    if(num<0){
                        global.push(globalArts[t])
                    }
                }else{
                    global.push(globalArts[t]);
                }

            }
            articles.push(...global);
        }
        if(show==false){
          let newArticles:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"classifyId" in(:id)',{id:newArray}).andWhere('"topPlace"=\'current\' or "topPlace"=\'cancel\'').andWhere('"name"like :name',{name:str}).orderBy('"updateAt"','ASC').getMany();
          articles.push(...newArticles);
          level=5;
        }
        if(show==undefined){
            level=4;
        }
        if(level==1){
            let newArticles:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"classifyId" in (:id)',{id:newArray}).andWhere('"topPlace"= :topPlace',{topPlace:'level1'}).andWhere('"name"like :name and recycling=false',{name:str}).orderBy('"updateAt"','ASC').getMany();
            articles.push(...newArticles);
            let finalArticles:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"classifyId"= :classifyId  and "topPlace"<>\'global\'',{classifyId:id}).andWhere('"name"like :name and recycling=false',{name:str}).orderBy('"updateAt"','ASC').getMany();
            articles.push(...finalArticles);
        }else if(level==2){
            let newArticles=await this.artRepository.createQueryBuilder().where('"classifyId" in (:id)',{id:newArray}).andWhere('"topPlace"= :topPlace',{topPlace:'level2'}).andWhere('"name"like :name and recycling=false',{name:str}).orderBy('"updateAt"','ASC').getMany();
            articles.push(...newArticles);
            let finalArticles:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"classifyId"= :classifyId and "topPlace"<>\'level1\' and "topPlace"<>\'global\'',{classifyId:id}).andWhere('"name"like :name and recycling=false',{name:str}).orderBy('"updateAt"','ASC').getMany();
            articles.push(...finalArticles);
        }else if(level==3){
            let newArticles=await this.artRepository.createQueryBuilder().where('"classifyId" in (:id)',{id:newArray}).andWhere('"topPlace"= :topPlace',{topPlace:'level3'}).andWhere('"name"like :name and recycling=false',{name:str}).orderBy('"updateAt"','ASC').getMany();
            articles.push(...newArticles);
            let finalArticles:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"classifyId"= :classifyId and "topPlace"<>\'level2\' and "topPlace"<>\'global\'',{classifyId:id}).andWhere('"name"like :name and recycling=false',{name:str}).orderBy('"updateAt"','ASC').getMany();
            articles.push(...finalArticles);
        }else if(level==4){
            let newArticles=await this.artRepository.createQueryBuilder().where('"classifyId" in (:id) and recycling=false' ,{id:newArray}).andWhere('"name"like :name',{name:str}).orderBy('"updateAt"','ASC').getMany();
            articles.push(...newArticles);
        }
        let num:number=articles.length;
        let returnArt:ArticleEntity[]=await this.Fenji(articles,limit,pages);
        return {articles:returnArt,totalItems:num};
    }
    async Fenji(art:ArticleEntity[],limit?:number,pages?:number):Promise<ArticleEntity[]>{
        let newArt:ArticleEntity[]=[];
        if(limit){
            newArt=art.splice(limit*(pages-1),limit);
        }else {
            newArt=art;
        }
        return newArt;

    }
    /**
     * 获取当前分类所有子分类id
     * @param {number} id
     * @returns {Promise<number[]>}
     */
    async  getClassifyId(id:number):Promise<number[]>{
        await getManager().query("update public.article_classify_table set \"parentId\" = \"groupId\"");
        let entity:ClassifyEntity[]=await this.repository.createQueryBuilder().where('"groupId"= :groupId',{groupId:id}).getMany();
        let array:number[]=[];
        if(entity.length>0){
            const result=await this.repository.createQueryBuilder('article_classify_table').where('article_classify_table.id= :id',{id:id}).innerJoinAndSelect('article_classify_table.children','children').orderBy('article_classify_table.id').getMany();
            let firstArray:ClassifyEntity[]=result;
            for(let t in firstArray){
                array.push(firstArray[t].id);
                if(firstArray[t].children.length>0){
                    for(let h in firstArray[t].children){
                        array.push(firstArray[t].children[h].id);
                        array.push(...await this.getClassifyId(firstArray[t].children[h].id));
                    }
                }
            }
        }
       array.push(id);
        return array;
    }
    /**
     * 获取当前分类所有子分类id
     * @param {number} id
     * @returns {Promise<number[]>}
     */
    async  getClassifyIdPage(id:number):Promise<number[]>{
        await getManager().query("update public.page_classify_table set \"parentId\" = \"groupId\"");
        let array:number[]=[];
        let entity:PageClassifyEntity[]=await this.pageRepository.createQueryBuilder().where('"groupId"= :groupId',{groupId:id}).getMany();
        if(entity.length>0){
            const result =await this.pageRepository.createQueryBuilder('page_classify_table').where('page_classify_table.id= :id',{id:id}).innerJoinAndSelect('page_classify_table.children','children').getMany();
            let firstArray:PageClassifyEntity[]=result;
            for(let t in firstArray){
                array.push(firstArray[t].id);
                if(firstArray[t].children.length>0){
                    for(let h in firstArray[t].children){
                        array.push(firstArray[t].children[h].id);
                        array.push(...await this.getClassifyIdPage(firstArray[t].children[h].id));
                    }
                }
            }
        }
        array.push(id);
        return array;
    }
    /**
     * 获取当前分类级别
     * @param {number} id
     * @returns {Promise<void>}
     */
    public async findLevel(id:number):Promise<number>{
        let arr:ClassifyEntity[]=await this.repository.find();
        let final:ClassifyEntity[]=await this.showClassifyLevel(arr,id,0).then(a=>{return a});
        let num:number;
        for(let t in final){
            if(final[t].id==1){
                num=final[t].level;
            }
        }
        return num;
    }

    /**
     * 找出分类级别
     * @param {number} ids
     * @returns {Promise<number>}
     */
    public async showClassifyLevel(arr:ClassifyEntity[],id:number,level:number){
        let array:ClassifyEntity[]=[];
        for(let t in arr){
            if(arr[t].id==id){
                arr[t].level=level;
                let newClas:ClassifyEntity=arr[t];
                array.push(newClas);
               let arrayCla:ClassifyEntity[]=await this.showClassifyLevel(arr, arr[t].groupId,level+1);
               array.push(...arrayCla);

            }
        }
        return array;
    }

    /**
     * 级别转换
     * @param {number} level
     * @returns {string}
     */
    public interfaceChange(level?:number):string{
        let finalLevel:string;
        if(level==1){
            finalLevel='level1';
        }else if(level==2){
            finalLevel='level2';
        }else if(level==3){
            finalLevel='level3';
        }else if(level==4){
            finalLevel=='current';
        }
        return finalLevel;
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
        let array:number[]=await this.getClassifyId(id).then(a=>{return a});
        array.push(id);
        let newArray:number[]=Array.from(new Set(array));
        this.resetTheSetTop(newArray);
        let time =new Date();
        classify.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
        let newClassify:ClassifyEntity=classify;
        this.repository.updateById(newClassify.id,newClassify);
        return this.findAllClassifyArt(1);

    }

    /**
     * 重置置顶关系
     * @param {number[]} arr
     * @returns {Promise<void>}
     */
    public async resetTheSetTop(arr:number[]){
        let articles:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"classifyId" in (:id)',{id:arr}).getMany();
        let time =new Date();
        for(let t in articles){
            let arr=new ArticleEntity;
            arr=articles[t];
            arr.topPlace='cancel';
            arr.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
            await this.artRepository.updateById(arr.id,arr);
        }
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

    /**
     * 根据分类id查找页面分类本身
     * @param {number} id
     * @returns {Promise<PageClassifyEntity>}
     */
    public async findOnePageClassifyById(id:number):Promise<PageClassifyEntity>{
        let final:PageClassifyEntity=await this.pageRepository.findOneById(id);
        return final;
    }

    /**
     * 判断默认分类是否存在
     * @param {string} Alias
     * @param {string} useFor
     * @returns {Promise<number>}
     */
    public async findTheDefaultByAlias(Alias:string,useFor:string){
        let numId:number=0;
        if(useFor=='art'){
            let defaultArt:ClassifyEntity=await this.repository.createQueryBuilder().where('"classifyAlias"= :classifyAlias',{classifyAlias:Alias}).getOne();
            if(defaultArt==null){
                let classify =new ClassifyEntity();
                classify.groupId=1;
                classify.title='默认分类';
                classify.classifyAlias='默认分类';
                classify.describe='默认分类';
                const result:string=await this.repository.createQueryBuilder().insert().into(ClassifyEntity).values(classify).output('id').execute();
                let str:string=JSON.stringify(result);
                let newstr:string=str.replace('{','').replace('}','').replace('[','').replace(']','');
                let finalStr:string[]=newstr.replace('"','').replace('"','').split(':');
                numId=Number(finalStr[1]);
            }else{
                numId=defaultArt.id;
            }
        }else if(useFor=='page'){
            let defaultPage:PageClassifyEntity=await this.pageRepository.createQueryBuilder().where('"classifyAlias"= :classifyAlias',{classifyAlias:Alias}).getOne();
            if(defaultPage==null){
                let classify =new PageClassifyEntity();
                classify.groupId=1;
                classify.title='默认分类';
                classify.classifyAlias='默认分类';
                classify.describe='默认分类';
                const result=await this.pageRepository.createQueryBuilder().insert().into(PageClassifyEntity).values(classify).output('id').execute();
                let str:string=JSON.stringify(result);
                let newstr:string=str.replace('{','').replace('}','').replace('[','').replace(']','');
                let finalStr:string[]=newstr.replace('"','').replace('"','').split(':');
                numId=Number(finalStr[1]);
            }else{
                numId=defaultPage.id;
            }
        }
        return numId;
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

    /**
     * 分类批量置顶到全局
     * @param {number} id
     * @returns {Promise<number>}
     */
    async classifyTopPlace(id:number,display?:number[]){
        let entity:ClassifyEntity=await this.repository.findOneById(id);
        if(entity==null) throw new MessageCodeError('page:classify:classifyIdMissing');
        let array:number[]=await this.getClassifyId(id).then(a=>{return a});
        array.push(id);
        let newArray:number[]=Array.from(new Set(array));
        let num:number=0;
        let result:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"classifyId" in (:id)',{id:newArray}).andWhere('"topPlace"<> :topPlace',{topPlace:'global'}).getMany();
        let numArray:number[]=[];
        for(let t in display){
            let array:number[]=await this.getClassifyId(display[t]).then(a=>{return a});
            let newArray:number[]=Array.from(new Set(array));
            numArray.push(...newArray);
        }
        numArray.push(...display);
        let finalArray:number[]=Array.from(new Set(numArray));
        for(let t in result){
            let newArt=new ArticleEntity;
            newArt=result[t];
            newArt.topPlace='global';
            newArt.display=finalArray.toString();
            let time =new Date();
            newArt.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
            this.artRepository.updateById(newArt.id,newArt);
            num++
        }
        return num;
    }

    /**
     * 获取单个具体分类
     * @param {string} useFor
     * @param {number} id
     * @returns {Promise<{classify: any; MessageCodeError: any}>}
     */
    async  findClassifyById(useFor:string,id:number){
        let result,MessageCodeError;
        let array:number[]=[];
        if(useFor=='art'){
            let entity:ClassifyEntity=await this.repository.findOneById(id);
            if(entity==null) MessageCodeError='当前分类不存在';
            array.push(id);array.push(entity.groupId);
            result=await this.repository.createQueryBuilder().where('"id" in (:id)',{id:array}).orderBy('id','ASC').getMany();
        }
        if(useFor=='page'){
            let entity:PageClassifyEntity=await this.pageRepository.findOneById(id);
            if(entity==null) MessageCodeError='当前分类不存在';
            array.push(id);array.push(entity.groupId);
            result=await this.pageRepository.createQueryBuilder().where('"id" in (:id)',{id:array}).orderBy('id','ASC').getMany();
        }
        if(result!=null){
            MessageCodeError='查找成功';
        }
        return {classifyEntity:result,MessageCodeError:MessageCodeError};
    }

    /**
     * 文章时间格式转化
     * @param {ArticleEntity[]} art
     * @returns {Promise<Article[]>}
     * @constructor
     */
    async TimestampArt(art:ArticleEntity[]){
        let result:Article[]=[];
        for(let t in art){
            if(art[t].id!=null){
                let entity=new Article();
                let time:Date= art[t].createAt;
                let createAt:Date=new Date(time.getTime()+time.getTimezoneOffset()*2*30*1000);
                let newTime:Date=art[t].updateAt;
                let update:Date=new Date(newTime.getTime()+newTime.getTimezoneOffset()*2*30*1000);
                if(art[t].publishedTime!=null){
                    let publish:Date=art[t].publishedTime;
                    let publishDate:Date=publish;
                    entity.publishedTime=`${publishDate.toLocaleDateString()} ${publishDate.toLocaleTimeString()}`;
                }
                entity.createAt=`${createAt.toLocaleDateString()} ${createAt.toLocaleTimeString()}`;
                entity.updateAt=`${update.toLocaleDateString()} ${update.toLocaleTimeString()}`;
                entity.id=art[t].id;
                entity.name=art[t].name;
                entity.classifyId=art[t].classifyId;
                let timeOne=await this.repository.createQueryBuilder().where('"id"= :id',{id:art[t].classifyId}).getOne().then(a=>{return a.title});
                entity.classify=timeOne;
                entity.abstract=art[t].abstract;
                entity.content=art[t].content;
                entity.url=art[t].url;
                entity.source=art[t].source;
                entity.sourceUrl=art[t].sourceUrl;
                entity.topPlace=art[t].topPlace;
                entity.abstract=art[t].abstract;
                entity.hidden=art[t].hidden;
                entity.pictureUrl=art[t].pictureUrl;
                entity.id=art[t].id;
                entity.recycling=art[t].recycling;
                entity.check=false;
                result.push(entity);
            }
            }

        return result;
    }
    /**
     * 页面时间格式转化
     * @param {ArticleEntity[]} art
     * @returns {Promise<Article[]>}
     * @constructor
     */
    async TimestampPage(art:PageEntity[]){
        let result:Page[]=[];
        for(let t in art){
            let entity=new Page();
            let time:Date= art[t].createAt;
            let createAt:Date=new Date(time.getTime()+time.getTimezoneOffset()*2*30*1000);
            let newTime:Date=art[t].updateAt;
            let update:Date=new Date(newTime.getTime()+newTime.getTimezoneOffset()*2*30*1000)
            entity.createAt=`${createAt.toLocaleDateString()} ${createAt.toLocaleTimeString()}`;
            entity.updateAt=`${update.toLocaleDateString()} ${update.toLocaleTimeString()}`;
            entity.id=art[t].id;
            entity.classifyId=art[t].classifyId;
            let timeOne=await this.pageRepository.createQueryBuilder().where('"id"= :id',{id:art[t].classifyId}).getOne().then(a=>{return a.title});
            entity.classify=timeOne;
            entity.title=art[t].title;
            entity.alias=art[t].alias;
            entity.check=false;
            result.push(entity);
        }
        return result;
    }
    async pageServiceArt(totalItems?:number,limit?:number,page?:number){
        let result=this.pageService.getPager(totalItems,page,limit);
        let res=new ReturnPage();
            res.totalItems=result.totalItems;
            res.currentPage=result.currentPage;
            res.pageSize=result.pageSize;
            res.totalPages=result.totalPages;
            res.startPage=result.startPage;
            res.endPage= result.endPage;
            res.startIndex=result.startIndex;
            res.endIndex= result.endIndex;
            res.pages= result.pages;
         return res;
    }

    /**
     *
     * @param {string} useFor
     * @param {number} id
     * @param {string} alias
     * @param {number} deleteNum
     * @returns {Promise<{MessageCodeError: any; Continue: boolean}>}
     */
    async classifyCheck(useFor:string,id?:number,groupId?:number,alias?:string,deleteNum?:number){
        let result;
        let update:boolean=true;
        console.log('useFor='+useFor+",id="+id+",groupId="+groupId+",deleteNum="+deleteNum);
        if(id>0){
            if(useFor=='art'){
                let entity:ClassifyEntity=await this.repository.findOneById(id);
                if(entity==null) result="当前文章分类不存在";update=false;
            }else{
                let entity:PageClassifyEntity=await this.pageRepository.findOneById(id);
                if(entity==null) result="当前页面分类不存在";update=false;
            }
        }
        if(groupId>0){
            if(useFor=='art'){
                let entity:ClassifyEntity=await this.repository.findOneById(groupId);
                if(entity==null) result="当前文章分类父级分类不存在";update=false;
            }else{
                let entity:PageClassifyEntity=await this.pageRepository.findOneById(groupId);
                if(entity==null) result="当前页面分类父级分类不存在";update=false;
            }
        }
        if(alias){
            if(useFor=='art'){
                let newClassify:ClassifyEntity[] = await this.repository.createQueryBuilder().where('"classifyAlias"= :classifyAlias',{classifyAlias:alias}).getMany();
                if(newClassify.length>0) result="别名不能重复";update=false;
            }else{
                let newClassify:PageClassifyEntity[] = await this.pageRepository.createQueryBuilder().where('"classifyAlias"= :classifyAlias',{classifyAlias:alias}).getMany();
                if(newClassify.length>0) result="别名不能重复";update=false;
            }
        }
        if(deleteNum>0){
            if(useFor=='art'){
                let entity=await this.repository.findOneById(deleteNum);
                if(entity==null) {
                    result='当前分类不存在';
                    update=false;
                }else{
                    let array:number[]=await this.getClassifyId(deleteNum).then(a=>{return a});
                    let newArray:number[]=Array.from(new Set(array));
                    let artiicles:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"classifyId" in (:id)',{id:newArray}).getMany();
                    if(artiicles.length>0) result='当前分类下有文章,不能删除';update=false;
                }

            }else{
                let entity=await this.pageRepository.findOneById(deleteNum);
                if(entity==null) {
                    result='当前分类不存在';
                    update=false;
                }else{
                    let array:number[]=await this.getClassifyIdPage(deleteNum).then(a=>{return a});
                    let newArray:number[]=Array.from(new Set(array));
                    let artiicles:PageEntity[]=await this.repositoryPage.createQueryBuilder().where('"classifyId" in (:id)',{id:newArray}).getMany();
                    if(artiicles.length>0) result='当前分类下有页面,不能删除';update=false;
                }
            }
        }
        console.log('result='+result+",Continue="+update);
        if(!result){
            update=true;
        }
        return{MessageCodeError:result,Continue:update}
    }
}
