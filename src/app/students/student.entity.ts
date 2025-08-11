import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Responsible } from '../responsible/responsible.entity';

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    age: number;

    @Column()
    contactNumber: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    googleCode: string;

    @OneToMany(() => Responsible, responsible => responsible.student)
    responsibles: Responsible[];
}
