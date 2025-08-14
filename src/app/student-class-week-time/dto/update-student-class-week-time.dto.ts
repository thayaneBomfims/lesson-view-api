// src/student-class-week-time/dto/update-student-class-week-time.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentClassWeekTimeDto } from './create-student-class-week-time.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateStudentClassWeekTimeDto extends PartialType(CreateStudentClassWeekTimeDto) {
    @IsOptional()
    @IsInt()
    studentClassId?: number;

    @IsOptional()
    @IsInt()
    weekTimeId?: number;
}
