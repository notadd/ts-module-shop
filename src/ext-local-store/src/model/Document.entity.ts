import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AbstractFile } from './AbstractFile'
import { Bucket } from './Bucket.entity'

@Entity({
    name: 'document'
})
export class Document extends AbstractFile {

    @Column({ nullable: true })
    bucketId: number

    @ManyToOne(type => Bucket, bucket => bucket.documents, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        nullable: false,
        lazy: false
    })
    @JoinColumn()
    bucket: Bucket;
}