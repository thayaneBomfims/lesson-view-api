import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Class } from "./class.entity";
import { Repository } from "typeorm";
import { ReadClassDto } from "./dto/read-class.dto";
import { CreateClassDto } from "./dto/create-class.dto";

@Injectable()
export class ClassesService {
    constructor(
        @InjectRepository(Class)
        private readonly repo: Repository<Class>,
    ) { }

    create(data: Partial<CreateClassDto>) {
        const item = this.repo.create(data);
        return this.repo.save(item);
    }

    findAll(): Promise<ReadClassDto[]> {
        return this.repo.find();
    }

    findOne(id: number): Promise<ReadClassDto> {
        return this.repo.findOne({ where: { id } });
    }

    async update(id: number, data: Partial<CreateClassDto>) {
        await this.repo.update(id, data);
        return this.findOne(id);
    }

    delete(id: number) {
        return this.repo.delete(id);
    }
}
