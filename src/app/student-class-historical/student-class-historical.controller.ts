import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { CreateStudentClassHistoricalDto } from './dto/create-student-class-historical.dto';
import { UpdateStudentClassHistoricalDto } from './dto/update-student-class-historical.dto';
import { StudentsClassHistoricalService } from './student-class-historical.service';

@Controller('students-class-historical')
export class StudentsClassHistoricalController {
  constructor(private readonly service: StudentsClassHistoricalService) { }

  @Post()
  create(@Body() dto: CreateStudentClassHistoricalDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('studentClassId') studentClassId?: string) {
    return this.service.findAll(studentClassId ? Number(studentClassId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStudentClassHistoricalDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
