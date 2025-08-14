import { Module } from '@nestjs/common';
import { StudentClassWeekTimeService } from './student-class-week-time.service';
import { StudentClassWeekTimeController } from './student-class-week-time.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentClassWeekTime } from './student-class-week-time.entity';
import { StudentClass } from '../student-class/student-class.entity';
import { WeekTime } from '../week-time/week-time.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentClassWeekTime, StudentClass, WeekTime])],
  controllers: [StudentClassWeekTimeController],
  providers: [StudentClassWeekTimeService],
})
export class StudentClassWeekTimeModule { }
