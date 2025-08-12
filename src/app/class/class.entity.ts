import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { StudentClass } from '../student-class/student-class.entity';

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

    @OneToMany(() => StudentClass, (sc) => sc.class)
    studentClasses: StudentClass[];

}
