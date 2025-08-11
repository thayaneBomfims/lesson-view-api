import { Repository } from "typeorm";
import { CreateWeekTimeDto } from "./dto/create-week-time.dto";
import { WeekTime } from "./week-time.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { ReadWeekTimeDto } from "./dto/read-week-time.dto";
import { UpdateWeekTimeDto } from "./dto/update-week-time.dto";

@Injectable()
export class WeekTimeService {
    constructor(
        @InjectRepository(WeekTime)
        private readonly repo: Repository<WeekTime>,
    ) { }

    create(data: Partial<CreateWeekTimeDto>): Promise<ReadWeekTimeDto> {
        const item = this.repo.create(data);
        return this.repo.save(item);
    }

    findAll(
        filters: { weekDay?: string; active?: boolean }
    ): Promise<ReadWeekTimeDto[]> {
        const where: any = {};

        if (filters.weekDay !== undefined) {
            where.weekDay = filters.weekDay;
        }

        if (filters.active !== undefined) {
            where.available = filters.active;
        }
        return this.repo.find({
            where,
            order: { weekDay: 'ASC', time: 'ASC' }
        });
    }

    findOne(id: number): Promise<ReadWeekTimeDto> {
        return this.repo.findOne({ where: { id } });
    }

    async update(id: number, data: Partial<UpdateWeekTimeDto>): Promise<ReadWeekTimeDto> {
        await this.repo.update(id, data);
        return this.findOne(id);
    }

    delete(id: number) {
        return this.repo.delete(id);
    }
}
