import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentClass } from './student-class.entity';
import { CreateStudentClassDto } from './dto/create-student-class.dto';
import { UpdateStudentClassDto } from './dto/update-student-class.dto';
import { Student } from '../students/student.entity';
import { Class } from '../class/class.entity';

@Injectable()
export class StudentClassService {
  constructor(
    @InjectRepository(StudentClass)
    private readonly repo: Repository<StudentClass>,

    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,

    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
  ) { }

  async create(dto: CreateStudentClassDto) {
    const student = await this.studentRepo.findOneBy({ id: dto.studentId });
    if (!student) throw new NotFoundException('Student not found');

    const classEntity = await this.classRepo.findOneBy({ id: dto.classId });
    if (!classEntity) throw new NotFoundException('Class not found');

    const sc = this.repo.create({
      student,
      class: classEntity,
      studentStatus: dto.studentStatus,
    });

    return this.repo.save(sc);
  }

  findAll() {
    return this.repo.find({
      relations: ['student', 'class'],
      order: { created_at: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['student', 'class'],
    });
  }

  async update(id: number, dto: UpdateStudentClassDto) {
    const sc = await this.repo.findOneBy({ id });
    if (!sc) throw new NotFoundException('StudentClass not found');
    Object.assign(sc, dto);
    return this.repo.save(sc);
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('StudentClass not found');
    }
    return { deleted: true };
  }
}
