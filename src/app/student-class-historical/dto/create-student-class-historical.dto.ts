import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Performance } from '../student-class-historical.entity';

export class CreateStudentClassHistoricalDto {
    @IsNotEmpty()
    studentClassId: number;

    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    links?: string[];

    @IsEnum(Performance)
    performance: Performance;

    @IsOptional()
    @IsString()
    homework?: string;
}
