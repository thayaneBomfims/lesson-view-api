// src/student-class-week-time/student-class-week-time.service.ts
import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CreateStudentClassWeekTimeDto } from './dto/create-student-class-week-time.dto';
import { UpdateStudentClassWeekTimeDto } from './dto/update-student-class-week-time.dto';
import { FilterStudentClassWeekTimeDto } from './dto/filter-student-class-week-time.dto';
import { StudentClassWeekTime } from './student-class-week-time.entity';
import { StudentClass } from '../student-class/student-class.entity';
import { WeekTime } from '../week-time/week-time.entity';

@Injectable()
export class StudentClassWeekTimeService {
  constructor(
    @InjectRepository(StudentClassWeekTime)
    private readonly repo: Repository<StudentClassWeekTime>,
    @InjectRepository(StudentClass)
    private readonly scRepo: Repository<StudentClass>,
    @InjectRepository(WeekTime)
    private readonly wtRepo: Repository<WeekTime>,
  ) { }

  async create(dto: CreateStudentClassWeekTimeDto) {
    const [studentClass, weekTime] = await Promise.all([
      this.scRepo.findOne({ where: { id: dto.studentClassId }, relations: ['student', 'class'] }),
      this.wtRepo.findOne({ where: { id: dto.weekTimeId } }),
    ]);

    if (!studentClass) throw new NotFoundException('StudentClass not found');
    if (!weekTime) throw new NotFoundException('WeekTime not found');

    if (!weekTime.available) {
      throw new BadRequestException('This weekTime is already unavailable');
    }

    const exists = await this.repo.findOne({
      where: { studentClass: { id: studentClass.id }, weekTime: { id: weekTime.id } },
    });
    if (exists) throw new ConflictException('This studentClass is already linked to this weekTime');

    // Marca o WeekTime como indisponível
    weekTime.available = false;
    await this.wtRepo.save(weekTime);

    const link = this.repo.create({ studentClass, weekTime, totalLessons: dto.totalLessons ?? 4 });
    return this.repo.save(link);
  }

  async findAll(filters: FilterStudentClassWeekTimeDto = {}) {
    const where: FindOptionsWhere<StudentClassWeekTime> = {};

    if (filters.studentClassId) {
      where.studentClass = { id: filters.studentClassId } as any;
    }
    if (filters.weekTimeId) {
      where.weekTime = { id: filters.weekTimeId } as any;
    }

    // filtros “atravessando” relações (conveniência)
    // como os relacionamentos estão eager, podemos filtrar via query builder para studentId/classId
    if (filters.studentId || filters.classId) {
      const qb = this.repo.createQueryBuilder('link')
        .leftJoinAndSelect('link.studentClass', 'sc')
        .leftJoinAndSelect('link.weekTime', 'wt')
        .leftJoinAndSelect('sc.student', 'student')
        .leftJoinAndSelect('sc.class', 'class');

      if (filters.studentId) qb.andWhere('student.id = :studentId', { studentId: filters.studentId });
      if (filters.classId) qb.andWhere('class.id = :classId', { classId: filters.classId });

      if (filters.studentClassId) qb.andWhere('sc.id = :scId', { scId: filters.studentClassId });
      if (filters.weekTimeId) qb.andWhere('wt.id = :wtId', { wtId: filters.weekTimeId });

      return qb.orderBy('link.created_at', 'DESC').getMany();
    }

    return this.repo.find({
      where,
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Link not found');
    return found;
  }

  async update(id: number, dto: UpdateStudentClassWeekTimeDto) {
    const link = await this.repo.findOne({ where: { id } });
    if (!link) throw new NotFoundException('Link not found');

    if (dto.studentClassId) {
      const sc = await this.scRepo.findOne({ where: { id: dto.studentClassId } });
      if (!sc) throw new NotFoundException('StudentClass not found');
      link.studentClass = sc;
    }
    if (dto.weekTimeId) {
      const wt = await this.wtRepo.findOne({ where: { id: dto.weekTimeId } });
      if (!wt) throw new NotFoundException('WeekTime not found');
      link.weekTime = wt;
    }

    // Checa duplicidade ao trocar qualquer lado
    const duplicate = await this.repo.findOne({
      where: {
        studentClass: { id: link.studentClass.id },
        weekTime: { id: link.weekTime.id },
      },
    });
    if (duplicate && duplicate.id !== id) {
      throw new ConflictException('This combination already exists');
    }

    return this.repo.save(link);
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Link not found');
    return { deleted: true };
  }
}
