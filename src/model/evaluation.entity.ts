import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne, JoinColumn } from "typeorm";
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

    /* 外键字段需要添加唯一性约束，保证OneToOne关系 */
    @Column({ unique: true })
    userId: number;

    /* 用户与评论是OneToOne关系，且用户删除时，评论也要级联删除 */
    @OneToOne(type => User, {
        cascadeAll: false,
        nullable: false,
        lazy: false,
        eager: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "userId",
        referencedColumnName: "id"
    })
    user: User;

    /* 订单项外键列，也需要唯一性约束 */
    @Column({ unique: true })
    orderItemId: number;

    /* 评价与订单项是一对一关系，用户只能在完成订单后对订单中的订单项进行评论 */
    @OneToOne(type => OrderItem, {
        cascadeAll: false,
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
