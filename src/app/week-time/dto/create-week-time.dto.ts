import { IsEnum, IsString, IsBoolean } from 'class-validator';
import { WeekDay } from '../week-time.entity';

export class CreateWeekTimeDto {
    @IsEnum(WeekDay)
    weekDay: WeekDay;

    @IsString()
    time: string; // "14:00"
}
