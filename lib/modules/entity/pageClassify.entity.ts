import {
    Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity('page_classify_table')
export class PageClassifyEntity{
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

    @OneToMany(type => PageClassifyEntity,PageClassifyEntity =>PageClassifyEntity.parent,{cascadeInsert:true})
    children: PageClassifyEntity[];

    @ManyToOne(type => PageClassifyEntity,PageClassifyEntity =>PageClassifyEntity.children,{cascadeInsert:true})
    parent:PageClassifyEntity;

    //创建时间
    @CreateDateColumn() createAt:Date;
    //修改时间
    @UpdateDateColumn() updateAt:Date;
}