import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { StudentClass } from '../student-class/student-class.entity';


export enum Performance {
    EXCELLENT = 'excellent',
    GOOD = 'good',
    AVERAGE = 'average',
    POOR = 'poor',
}

@Entity('students_class_historical')
export class StudentClassHistorical {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StudentClass, (sc) => sc.id, { onDelete: 'CASCADE' })
    studentClass: StudentClass;

    @Column()
    subject: string;

    @Column({ type: 'simple-array', nullable: true })
    links: string[];

    @Column({ type: 'enum', enum: Performance })
    performance: Performance;

    @Column({ type: 'text', nullable: true })
    homework: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
