import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentClassHistoricalDto } from './create-student-class-historical.dto';

export class UpdateStudentClassHistoricalDto extends PartialType(CreateStudentClassHistoricalDto) { }
