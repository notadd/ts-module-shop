import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { Goods } from "./goods.entity";


/* 商品图片实体*/
@Entity("goods_image")
export class GoodsImage {

    @PrimaryGeneratedColumn({ name: "id", type: "integer" })
    id: number;

    @Column({
        name: "bucketName",
        type: "varchar",
        length: 20
    })
    bucketName: string;

    @Column({
        name: "name",
        type: "varchar",
        length: 100
    })
    name: string;

    @Column({
        name: "type",
        type: "varchar",
        length: 20
    })
    type: string;

    /* 商品删除时，所有图片级联删除，在这之前需要先删除存储的图片 */
    @ManyToOne(type => Goods, goods => goods.values, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "CASCADE",
        nullable: false,
        lazy: false,
        eager: false
    })
    goods: Goods;
}