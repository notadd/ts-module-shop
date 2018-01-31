import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {PageContentEntity} from "./page.content.entity";

@Entity('page_entity_table')
export class PageEntity{
    //页面id
    @PrimaryGeneratedColumn() id:number;
   //页面标题
    @Column({length:200}) title:string;
    //页面别名
    @Column({length:200}) alias:string;
    //页面分类Id
    @Column({nullable:true}) classifyId:number;
    //页面分类Id
    @Column({nullable:true}) classify:string;
    //创建时间
    @CreateDateColumn() createAt:Date;
    //修改时间
    @UpdateDateColumn() updateAt:Date;
   /* @OneToMany(type => PageContentEntity,PageContentEntity=>PageContentEntity.pages)*/
    contents:PageContentEntity[];
}
export class Page{
   id:number;
   title:string;
   alias:string;
   classifyId:number;
   classify:string;
   createAt:string;
   updateAt:string;
}
