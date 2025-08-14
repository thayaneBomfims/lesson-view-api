// src/student-class-week-time/dto/create-student-class-week-time.dto.ts
import { IsInt } from 'class-validator';

export class CreateStudentClassWeekTimeDto {
    @IsInt()
    studentClassId: number;

    @IsInt()
    weekTimeId: number;
}
