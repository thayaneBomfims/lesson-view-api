import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
