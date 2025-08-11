import { IsBoolean, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateWeekTimeDto } from './create-week-time.dto';

export class UpdateWeekTimeDto extends PartialType(CreateWeekTimeDto) {
    @IsOptional()
    @IsBoolean()
    available?: boolean;
}
