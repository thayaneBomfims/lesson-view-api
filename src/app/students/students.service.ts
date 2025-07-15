import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
    constructor(
        @InjectRepository(Student)
        private readonly repo: Repository<Student>,
    ) { }

    create(data: CreateStudentDto) {
        const student = this.repo.create(data);
        return this.repo.save(student);
    }

    findAll() {
        return this.repo.find();
    }

    findOne(id: number) {
        return this.repo.findOne({ where: { id } });
    }

    async update(id: number, data: Partial<CreateStudentDto>) {
        await this.repo.update(id, data);
        return this.findOne(id);
    }

    delete(id: number) {
        return this.repo.delete(id);
    }

    findByGoogleCode(code: string) {
        return this.repo.findOne({ where: { googleCode: code } });
    }
}
