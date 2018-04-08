import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {PageEntity} from "./page.entity";

@Entity('page_content_table')
export class PageContentEntity{
    //内容Id
    @PrimaryGeneratedColumn() id:number;
    //页面Id
    @Column() parentId:number;
    //页面内容
    @Column({nullable:true,length:10000}) content:string;
    @ManyToOne(type => PageEntity,page=>page.contents,{
        cascadeInsert:false,
        cascadeUpdate:false,
        cascadeRemove:false,
        onDelete:'CASCADE',
        lazy:false,
        eager:false,
        nullable:true
    })
    @JoinColumn({name:'parentId',referencedColumnName:'id'})
    page:PageEntity;
    //创建时间
    @CreateDateColumn() createAt:Date;
    //修改时间
    @UpdateDateColumn() updateAt:Date;

}