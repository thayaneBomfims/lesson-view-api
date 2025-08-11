import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Responsible } from './responsible.entity';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { UpdateResponsibleDto } from './dto/update-responsible.dto';
import { Student } from '../students/student.entity';

@Injectable()
export class ResponsibleService {
    constructor(
        @InjectRepository(Responsible)
        private readonly repo: Repository<Responsible>,
        @InjectRepository(Student)
        private readonly studentRepo: Repository<Student>,
    ) { }

    async create(data: CreateResponsibleDto): Promise<Responsible> {
        const student = await this.studentRepo.findOne({ where: { id: data.studentId } });
        if (!student) {
            throw new Error('Student not found');
        }

        const responsible = this.repo.create({
            name: data.name,
            contactNumber: data.contactNumber,
            contactEmail: data.contactEmail,
            student,
        });
        return this.repo.save(responsible);
    }

    findAll(studentId?: number): Promise<Responsible[]> {
        const where: any = {};
        if (studentId) {
            where.student = { id: studentId };
        }
        return this.repo.find({
            where,
            relations: ['student'],
            order: { name: 'ASC' },
        });
    }

    findOne(id: number): Promise<Responsible> {
        return this.repo.findOne({ where: { id }, relations: ['student'] });
    }

    async update(id: number, data: UpdateResponsibleDto): Promise<Responsible> {
        if (data.studentId) {
            const student = await this.studentRepo.findOne({ where: { id: data.studentId } });
            if (!student) {
                throw new Error('Student not found');
            }
            await this.repo.update(id, { ...data, student });
        } else {
            await this.repo.update(id, data);
        }
        return this.findOne(id);
    }

    delete(id: number) {
        return this.repo.delete(id);
    }
}
