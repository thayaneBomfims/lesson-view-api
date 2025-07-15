import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../guards/admin.guard';

@UseGuards(AdminGuard)
@Controller('classes')
export class ClassesController {
    constructor(private readonly service: ClassesService) { }

    @Post()
    create(@Body() dto: CreateClassDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreateClassDto>) {
        return this.service.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.delete(+id);
    }
}
