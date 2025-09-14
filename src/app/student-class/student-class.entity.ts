import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { Student } from '../students/student.entity';
import { Class } from '../class/class.entity';
import { StudentClassWeekTime } from '../student-class-week-time/student-class-week-time.entity';
import { StudentClassHistorical } from '../student-class-historical/student-class-historical.entity';

export enum StudentStatus {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
}

@Entity('students_classes')
export class StudentClass {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Student, (student) => student.studentClasses, {
        onDelete: 'CASCADE',
    })
    student: Student;

    @ManyToOne(() => Class, (classEntity) => classEntity.studentClasses, {
        onDelete: 'CASCADE',
    })
    class: Class;

    @Column({
        type: 'enum',
        enum: StudentStatus,
        default: StudentStatus.BEGINNER,
    })
    studentStatus: StudentStatus;

    @OneToMany(() => StudentClassWeekTime, (scwt) => scwt.studentClass)
    studentClassWeekTimes: StudentClassWeekTime[];

    @OneToMany(() => StudentClassHistorical, (sch) => sch.studentClass)
    studentClassHistoricals: StudentClassHistorical[];

    @CreateDateColumn()
    created_at: Date;
}
