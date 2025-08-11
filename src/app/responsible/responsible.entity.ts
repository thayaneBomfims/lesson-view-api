import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../students/student.entity';

@Entity()
export class Responsible {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  contactNumber: string;

  @Column()
  contactEmail: string;

  @ManyToOne(() => Student, student => student.responsibles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
