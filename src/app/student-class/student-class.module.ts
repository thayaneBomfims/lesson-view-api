import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentClassService } from './student-class.service';
import { StudentClassController } from './student-class.controller';
import { StudentClass } from './student-class.entity';
import { Student } from '../students/student.entity';
import { Class } from '../class/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentClass, Student, Class])],
  controllers: [StudentClassController],
  providers: [StudentClassService],
})
export class StudentClassModule { }
