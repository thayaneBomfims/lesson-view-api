// src/student-class-week-time/student-class-week-time.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { StudentClassWeekTimeService } from './student-class-week-time.service';
import { CreateStudentClassWeekTimeDto } from './dto/create-student-class-week-time.dto';
import { UpdateStudentClassWeekTimeDto } from './dto/update-student-class-week-time.dto';
import { FilterStudentClassWeekTimeDto } from './dto/filter-student-class-week-time.dto';

@Controller('student-class-week-time')
export class StudentClassWeekTimeController {
  constructor(private readonly service: StudentClassWeekTimeService) { }

  @Post()
  create(@Body() dto: CreateStudentClassWeekTimeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() filters: FilterStudentClassWeekTimeDto) {
    // Ex.: /student-class-week-time?student_id=1&class_id=2
    return this.service.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudentClassWeekTimeDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
