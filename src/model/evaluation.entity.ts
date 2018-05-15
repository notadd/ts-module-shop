import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { EvaluationImage } from "./evaluation.image.entity";
import { OrderItem } from "./order.item.entity";
import { User } from "@notadd/user";

/* 用户评论实体类，用户只有在一笔订单完成之后才能对订单中的一个单品进行评论 */
@Entity("evaluation")
export class Evaluation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 200 })
    content: string;

    @Column()
    display: boolean;

    /**/
    @Column()
    userId: number;

    /* 订单项外键列，也需要唯一性约束 */
    @Column({ unique: true })
    orderItemId: number;

    /* 评价图片，保存评价时可以级联保存图片 */
    @OneToMany(type => EvaluationImage, evaluationImage => evaluationImage.evaluation, {
        cascade: ["insert"],
        lazy: false,
        eager: false
    })
    images: Array<EvaluationImage>;

    /* 用户与评论是ManyToOne关系，一个用户有多个评价 */
    @ManyToOne(type => User, {
        cascade: false,
        nullable: false,
        lazy: false,
        eager: false,
        onDelete: "CASCADE"
    })
    user: User;

    /*
    评价与订单项是一对一关系，用户只能在完成订单后对订单中的订单项进行评论
    关系可以级联更新订单项
    */
    @OneToOne(type => OrderItem, orderItem => orderItem.evaluation, {
        cascade: ["update"],
        nullable: false,
        lazy: false,
        eager: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "orderItemId",
        referencedColumnName: "id"
    })
    orderItem: OrderItem;

}
