// src/student-class-week-time/dto/create-student-class-week-time.dto.ts
import { IsInt, IsOptional } from 'class-validator';

export class CreateStudentClassWeekTimeDto {
    @IsInt()
    studentClassId: number;

    @IsInt()
    weekTimeId: number;

    @IsOptional()
    @IsInt()
    totalLessons?: number;
}
