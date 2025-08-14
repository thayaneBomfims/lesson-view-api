import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentClassHistorical } from './student-class-historical.entity';
import { StudentClass } from '../student-class/student-class.entity';
import { StudentsClassHistoricalController } from './student-class-historical.controller';
import { StudentsClassHistoricalService } from './student-class-historical.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudentClassHistorical, StudentClass])],
  controllers: [StudentsClassHistoricalController],
  providers: [StudentsClassHistoricalService],
})
export class StudentClassHistoricalModule { }
