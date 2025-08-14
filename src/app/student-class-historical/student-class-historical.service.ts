import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentClassHistorical } from './student-class-historical.entity';
import { CreateStudentClassHistoricalDto } from './dto/create-student-class-historical.dto';
import { UpdateStudentClassHistoricalDto } from './dto/update-student-class-historical.dto';
import { StudentClass } from '../student-class/student-class.entity';


@Injectable()
export class StudentsClassHistoricalService {
  constructor(
    @InjectRepository(StudentClassHistorical)
    private readonly repo: Repository<StudentClassHistorical>,

    @InjectRepository(StudentClass)
    private readonly scRepo: Repository<StudentClass>,
  ) { }

  async create(dto: CreateStudentClassHistoricalDto) {
    const studentClass = await this.scRepo.findOne({ where: { id: dto.studentClassId } });
    if (!studentClass) throw new NotFoundException('StudentClass not found');

    const historical = this.repo.create({
      studentClass,
      subject: dto.subject,
      links: dto.links,
      performance: dto.performance,
      homework: dto.homework,
    });

    return this.repo.save(historical);
  }

  findAll(studentClassId?: number) {
    const where = studentClassId ? { studentClass: { id: studentClassId } } : {};
    return this.repo.find({
      where,
      relations: ['studentClass'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const record = await this.repo.findOne({ where: { id }, relations: ['studentClass'] });
    if (!record) throw new NotFoundException('Historical not found');
    return record;
  }

  async update(id: number, dto: UpdateStudentClassHistoricalDto) {
    const record = await this.findOne(id);

    if (dto.studentClassId) {
      const studentClass = await this.scRepo.findOne({ where: { id: dto.studentClassId } });
      if (!studentClass) throw new NotFoundException('StudentClass not found');
      record.studentClass = studentClass;
    }

    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: number) {
    const record = await this.findOne(id);
    return this.repo.remove(record);
  }
}
