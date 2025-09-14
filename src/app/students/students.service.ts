import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { ReadStudentDto } from './dto/read-student.dto';

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

    findAll(email?: string): Promise<ReadStudentDto[]> {
        if (email) {
            return this.repo.find({ where: { email } });
        }
        return this.repo.find();
    }

    findOne(id: number): Promise<Student> {
        return this.repo.findOne({
            where: { id },
            relations: [
                'responsibles',
                'studentClasses',
                'studentClasses.class',
                'studentClasses.studentClassWeekTimes',
                'studentClasses.studentClassWeekTimes.weekTime',
                'studentClasses.studentClassHistoricals'
            ]
        });
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
