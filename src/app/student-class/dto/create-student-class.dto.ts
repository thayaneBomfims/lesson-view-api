import { IsEnum, IsInt } from 'class-validator';
import { StudentStatus } from '../student-class.entity';

export class CreateStudentClassDto {
    @IsInt()
    studentId: number;

    @IsInt()
    classId: number;

    @IsEnum(StudentStatus)
    studentStatus: StudentStatus;
}
