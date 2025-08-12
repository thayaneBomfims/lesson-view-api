import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
} from 'typeorm';
import { Student } from '../students/student.entity';
import { Class } from '../class/class.entity';

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

    @CreateDateColumn()
    created_at: Date;
}
