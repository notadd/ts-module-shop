import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Evaluation } from "./evaluation.entity";

/* 评价图片实体类 */
@Entity("evaluation_image")
export class EvaluationImage {

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

    /* 为了级联保存，外键要可以为空 */
    @Column({ nullable: true })
    evaluationId: number;

    /* 评价图片必然属于一个评价,评价删除时，图片级联删除 */
    @ManyToOne(type => Evaluation, evaluation => evaluation.images, {
        cascade: false,
        onDelete: "CASCADE",
        nullable: true,
        lazy: false,
        eager: false
    })
    evaluation: Evaluation;
}
