import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {PageEntity} from "./page.entity";

@Entity('page_content_table')
export class PageContentEntity{
    //内容Id
    @PrimaryGeneratedColumn() id:number;
    //页面Id
    @Column() parentId:number;
    //页面内容
    @Column({nullable:true,length:10000}) content:string;
    //创建时间
    @CreateDateColumn() createAt:Date;
    //修改时间
    @UpdateDateColumn() updateAt:Date;
}