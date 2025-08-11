import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Responsible } from './responsible.entity';
import { ResponsibleService } from './responsible.service';
import { ResponsibleController } from './responsible.controller';
import { Student } from '../students/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Responsible, Student])],
  providers: [ResponsibleService],
  controllers: [ResponsibleController]
})
export class ResponsibleModule { }
