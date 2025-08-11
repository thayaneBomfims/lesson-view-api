import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { ResponsibleService } from './responsible.service';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { UpdateResponsibleDto } from './dto/update-responsible.dto';

@Controller('responsibles')
export class ResponsibleController {
    constructor(private readonly service: ResponsibleService) { }

    @Post()
    create(@Body() data: CreateResponsibleDto) {
        return this.service.create(data);
    }

    @Get()
    findAll(@Query('studentId') studentId?: string) {
        return this.service.findAll(studentId ? Number(studentId) : undefined);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(Number(id));
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: UpdateResponsibleDto) {
        return this.service.update(Number(id), data);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(Number(id));
    }
}
