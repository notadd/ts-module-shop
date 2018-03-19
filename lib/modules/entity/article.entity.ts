import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {ClassifyEntity} from "./classify.entity";
enum EnvConfig{
    global,
    current,
    level1,
    level2,
    level3
}
@Entity('article_entity_table')
export class ArticleEntity{
    //文章Id
    @PrimaryGeneratedColumn() id:number;
    //文章名
    @Column({nullable:true,length:120}) name:string;
    //分类名称
    @Column({nullable:true,length:100}) classify:string;
    //分类Id
    @Column({nullable:true}) classifyId:number;
    //文章地址
    @Column({nullable:true,length:200}) url:string;
    //来源
    @Column({nullable:true,length:120}) source:string;
    //来源链接
    @Column({nullable:true,length:200}) sourceUrl:string;
    //置顶
    @Column() topPlace:string;
    //是否隐藏
    @Column({nullable:false}) hidden:boolean;
    //删除(回收站)
    @Column({nullable:true}) recycling:boolean;
    //发布时间
    @Column({nullable:true}) publishedTime:Date;
    //摘要
    @Column({nullable:true,length:500}) abstract:string;
    //内容
    @Column({nullable:true,length:65532}) content:string;
    //不显示分类
    @Column({nullable:true}) display:string;
    //开始时间
    @Column({nullable:true}) startTime:Date;
    //結束时间
    @Column({nullable:true}) endTime:Date;
    //活动时间
    @Column({nullable:true,length:300}) activityAddress:string;
    //主办单位
    @Column({nullable:true,length:200}) organizer:string;
    //活动人数
    @Column({nullable:true}) peopleNum:number;
    //创建时间
    @CreateDateColumn() createAt:Date;
    //修改时间
    @UpdateDateColumn() updateAt:Date;
    //空间名
    @Column({nullable:true,length:20}) bucketName:string;
    //图片名
    @Column({nullable:true,length:500}) pictureName:string;
    //图片类型
    @Column({nullable:true,length:30}) type:string;
    //图片地址
    @Column({nullable:true,length:500}) pictureUrl:string;

    @OneToMany(type => ClassifyEntity,ClassifyEntity=>ClassifyEntity.articles)
    classifications:ClassifyEntity[];

}
export class Article{
    id:number;
    name:string;
    classify:string;
    classifyId:number;
    url:string;
    source:string;
    sourceUrl:string;
    topPlace:string;
    hidden:boolean;
    recycling:boolean;
    publishedTime:string;
    endTime:string;
    startTime:string;
    activityAddress:string;
    organizer:string;
    peopleNum:number;
    abstract:string;
    content:string;
    display:string;
    createAt:string;
    updateAt:string;
    pictureUrl:string;
    classifications:ClassifyEntity[];
    check:boolean;

}