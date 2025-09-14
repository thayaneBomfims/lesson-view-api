// src/student-class-week-time/entities/student-class-week-time.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    Unique,
    JoinColumn,
    Column,
} from 'typeorm';
import { StudentClass } from '../student-class/student-class.entity';
import { WeekTime } from '../week-time/week-time.entity';

@Entity('student_class_week_time')
@Unique('UQ_studentClass_weekTime', ['studentClass', 'weekTime'])
export class StudentClassWeekTime {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StudentClass, (sc) => sc.id, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'student_class_id' })
    studentClass: StudentClass;

    @ManyToOne(() => WeekTime, (wt) => wt.id, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'week_time_id' })
    weekTime: WeekTime;

    @Column({ type: 'int', default: 4 })
    totalLessons: number;

    @Column({ type: 'int', default: 0 })
    completedLessons: number;

    @CreateDateColumn()
    created_at: Date;
}
