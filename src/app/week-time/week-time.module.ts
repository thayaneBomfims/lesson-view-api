import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeekTime } from './week-time.entity';
import { WeekTimeService } from './week-time.service';
import { WeekTimeController } from './week-time.controller';

@Module({
    imports: [TypeOrmModule.forFeature([WeekTime])],
    providers: [WeekTimeService],
    controllers: [WeekTimeController],
    exports: [WeekTimeService],
})
export class WeekTimeModule { }
