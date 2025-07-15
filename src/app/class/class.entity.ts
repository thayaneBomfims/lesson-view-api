import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum ClassType {
    VIRTUAL = 'online',
    DOMICILIO = 'home',
    INFANTIL = 'kids',
}

@Entity()
export class Class {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: ClassType })
    type: ClassType;

    @Column()
    service: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;
}
