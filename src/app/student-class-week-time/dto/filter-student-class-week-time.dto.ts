// src/student-class-week-time/dto/filter-student-class-week-time.dto.ts
import { IsInt, IsOptional } from 'class-validator';

export class FilterStudentClassWeekTimeDto {
    @IsOptional() @IsInt()
    studentClassId?: number;

    @IsOptional() @IsInt()
    weekTimeId?: number;

    // filtros convenientes adicionais (opcional):
    @IsOptional() @IsInt()
    studentId?: number;

    @IsOptional() @IsInt()
    classId?: number;
}
