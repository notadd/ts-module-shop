import {
    Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, UpdateDateColumn,
    CreateDateColumn
} from "typeorm";

@Entity('classify')
export class ClassifyEntity{
    //分类Id
    @PrimaryGeneratedColumn() id:number;
    //分类名称
    @Column({nullable:false,length:120}) classifyName:string;
    //分类别名
    @Column({nullable:false,length:120}) classifyAlias:string;
    //内链
    @Column({nullable:true,length:200}) chainUrl:string;
    //描述
    @Column({length:200}) describe:string;
    //颜色
    @Column({length:40}) color:string;
    //是否显示下一级分类文章
    @Column() showNext:boolean;
    //父节点
    @Column() parentId:number;
    //创建时间
    @CreateDateColumn() createAt:Date;
    //修改时间
    @UpdateDateColumn() updateAt:Date;

    @OneToMany(type => ClassifyEntity,ClassifyEntity =>ClassifyEntity.parent,{cascadeInsert:true})
    childrens: ClassifyEntity[];

    @ManyToOne(type => ClassifyEntity,ClassifyEntity =>ClassifyEntity.childrens,{cascadeInsert:true})
    parent:ClassifyEntity;
}