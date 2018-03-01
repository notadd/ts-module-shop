import {
    Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, UpdateDateColumn,
    CreateDateColumn
} from "typeorm";
import {ArticleEntity} from "./article.entity";

@Entity('article_classify_table')
export class ClassifyEntity{
    //分类Id
    @PrimaryGeneratedColumn() id:number;
    //分类名称
    @Column({nullable:false,length:120}) title:string;
    //分类别名
    @Column({nullable:false,length:120}) classifyAlias:string;
    //内链
    @Column({nullable:true,length:200}) chainUrl:string;
    //描述
    @Column({nullable:true,length:200}) describe:string;
    //颜色
    @Column({nullable:true,length:40}) color:string;
    //父节点
    @Column({nullable:true}) groupId:number;
    //层级
    @Column({nullable:true}) level:number;

    @OneToMany(type => ClassifyEntity,ClassifyEntity =>ClassifyEntity.parent,{cascadeInsert:true})
    children: ClassifyEntity[];

    @ManyToOne(type => ClassifyEntity,ClassifyEntity =>ClassifyEntity.children,{cascadeInsert:true})
    parent:ClassifyEntity;
    //创建时间
    @CreateDateColumn() createAt:Date;
    //修改时间
    @UpdateDateColumn() updateAt:Date;

    @ManyToOne(type => ArticleEntity,ArticleEntity=>ArticleEntity.classifications)
    articles:ArticleEntity;
}