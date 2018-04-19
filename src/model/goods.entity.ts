import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { PropertyValue } from "./property.value.entity";
import { ThirdClassify } from "./third.classify.entity";
import { GoodsImage } from "./goods.image.entity";
import { GoodsType } from "./goods.type.entity";
import { Brand } from "./brand.entity";
import { Sku } from "./sku.entity";

/* 商品实体，为一个商品的基本属性，名称、描述、基本价格等，一个商品必然属于一个分类、一个商品类型
   商品包含了多个属性值，有些为唯一属性，即直接属于商品，有些是单选、复选属性，属于指定价格的单品
*/
@Entity("goods")
export class Goods {

    @PrimaryGeneratedColumn({ name: "id", type: "integer" })
    id: number;

    @Column({
        name: "name",
        length: 50,
        unique: true
    })
    name: string;

    @Column({
        name: "name",
        length: 50
    })
    no: string;

    /* 商品基本价格，最终价格由基本价格与属性价格相加决定 */
    @Column({
        name: "base_price",
        type: "decimal",
        precision: 10,
        scale: 2
    })
    basePrice: number;

    /* 商品折扣价格 */
    @Column({
        name: "discount_price",
        type: "decimal",
        precision: 10,
        scale: 2,
        nullable: true
    })
    discountPrice: number;

    @Column({
        name: "description",
        type: "text"
    })
    description: string;

    @Column({
        name: "recycle",
        default: false
    })
    recycle: boolean;

    @Column({
        name: "classifyId"
    })
    classifyId: number;

    @Column({
        name: "typeId"
    })
    typeId: number;

    /* 分类删除时，其下存在商品，需要报错，不级联删除 */
    @ManyToOne(type => ThirdClassify, thirdClassify => thirdClassify.goodses, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "RESTRICT",
        nullable: false,
        lazy: false,
        eager: false
    })
    classify: ThirdClassify;

    /* 商品品牌 */
    @ManyToOne(type => Brand, brand => brand.goodses, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "RESTRICT",
        nullable: true,
        lazy: false,
        eager: false
    })
    brand: Brand;

    /* 商品类型删除时，其下存在商品需要报错，不级联删除 */
    @ManyToOne(type => GoodsType, goodsType => goodsType.goodses, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "RESTRICT",
        nullable: false,
        lazy: false,
        eager: false
    })
    type: GoodsType;

    @OneToMany(type => PropertyValue, propertyValue => propertyValue.goods, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    values: Array<PropertyValue>;

    @OneToMany(type => GoodsImage, goodsImage => goodsImage.goods, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    images: Array<GoodsImage>;

    @OneToMany(type => Sku, sku => sku.goods, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    skus: Array<Sku>;
}