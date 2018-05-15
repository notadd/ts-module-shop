import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { Goods } from "./goods.entity";

/* 商品图片实体*/
@Entity("goods_image")
export class GoodsImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20
    })
    bucketName: string;

    @Column({
        length: 100
    })
    name: string;

    @Column({
        length: 20
    })
    type: string;

    /* 商品删除时，所有图片级联删除，在这之前需要先删除存储的图片 */
    @ManyToOne(type => Goods, goods => goods.images, {
        cascade: false,
        onDelete: "CASCADE",
        nullable: true,
        lazy: false,
        eager: false
    })
    goods: Goods;
}
