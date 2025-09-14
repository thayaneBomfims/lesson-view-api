import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../guards/admin.guard';

@UseGuards(AdminGuard)
@Controller('students')
export class StudentsController {
    constructor(private readonly service: StudentsService) { }

    @Post()
    create(@Body() dto: CreateStudentDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll(@Query('email') email?: string) {
        return this.service.findAll(email);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreateStudentDto>) {
        return this.service.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.delete(+id);
    }
}
