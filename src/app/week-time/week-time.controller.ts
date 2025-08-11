import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    Query,
} from '@nestjs/common';
import { WeekTimeService } from './week-time.service';
import { CreateWeekTimeDto } from './dto/create-week-time.dto';
import { ReadWeekTimeDto } from './dto/read-week-time.dto';

@Controller('week-time')
export class WeekTimeController {
    constructor(private readonly service: WeekTimeService) { }

    @Post()
    create(@Body() dto: CreateWeekTimeDto): Promise<ReadWeekTimeDto> {
        return this.service.create(dto);
    }

    @Get()
    findAll(
        @Query('weekDay') weekDay?: string,
        @Query('active') active?: string,
    ): Promise<ReadWeekTimeDto[]> {
        const filters = {
            weekDay,
            active: active !== undefined ? active === 'true' : undefined,
        };
        return this.service.findAll(filters);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<ReadWeekTimeDto> {
        return this.service.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: Partial<CreateWeekTimeDto>,
    ): Promise<ReadWeekTimeDto> {
        return this.service.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.delete(+id);
    }
}
