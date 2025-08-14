import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Performance, StudentClassHistorical } from './student-class-historical.entity';
import { StudentClass } from '../student-class/student-class.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { StudentsClassHistoricalService } from './student-class-historical.service';

const mockStudentClass = { id: 1 };
const mockHistorical = {
  id: 1,
  studentClass: mockStudentClass,
  subject: 'Matemática',
  links: ['https://figma.com', 'https://whimsical.com'],
  performance: 'good',
  homework: 'Revisar capítulo 2',
};

describe('StudentsClassHistoricalService', () => {
  let service: StudentsClassHistoricalService;
  let repo: Repository<StudentClassHistorical>;
  let scRepo: Repository<StudentClass>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsClassHistoricalService,
        {
          provide: getRepositoryToken(StudentClassHistorical),
          useValue: {
            create: jest.fn().mockImplementation(dto => dto),
            save: jest.fn().mockResolvedValue(mockHistorical),
            find: jest.fn().mockResolvedValue([mockHistorical]),
            findOne: jest.fn().mockImplementation(({ where: { id } }) =>
              id === mockHistorical.id ? mockHistorical : null,
            ),
            remove: jest.fn().mockResolvedValue(mockHistorical),
          },
        },
        {
          provide: getRepositoryToken(StudentClass),
          useValue: {
            findOne: jest.fn().mockImplementation(({ where: { id } }) =>
              id === mockStudentClass.id ? mockStudentClass : null,
            ),
          },
        },
      ],
    }).compile();

    service = module.get<StudentsClassHistoricalService>(StudentsClassHistoricalService);
    repo = module.get<Repository<StudentClassHistorical>>(getRepositoryToken(StudentClassHistorical));
    scRepo = module.get<Repository<StudentClass>>(getRepositoryToken(StudentClass));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a historical record', async () => {
      const dto = {
        studentClassId: 1,
        subject: 'Matemática',
        links: ['https://figma.com', 'https://whimsical.com'],
        performance: Performance.GOOD,
        homework: 'Revisar capítulo 2',
      };
      const result = await service.create(dto);
      expect(scRepo.findOne).toHaveBeenCalledWith({ where: { id: dto.studentClassId } });
      expect(repo.create).toHaveBeenCalledWith({
        studentClass: mockStudentClass,
        subject: dto.subject,
        links: dto.links,
        performance: dto.performance,
        homework: dto.homework,
      });
      expect(repo.save).toHaveBeenCalledWith({
        studentClass: mockStudentClass,
        subject: dto.subject,
        links: dto.links,
        performance: dto.performance,
        homework: dto.homework,
      });
      expect(result).toEqual(mockHistorical);
    });

    it('should throw NotFoundException if studentClass not found', async () => {
      jest.spyOn(scRepo, 'findOne').mockResolvedValueOnce(null);
      await expect(
        service.create({
          studentClassId: 999,
          subject: 'Matemática',
          links: [],
          performance: Performance.GOOD,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all historical records', async () => {
      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalledWith({
        where: {},
        relations: ['studentClass'],
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual([mockHistorical]);
    });

    it('should filter by studentClassId', async () => {
      await service.findAll(1);
      expect(repo.find).toHaveBeenCalledWith({
        where: { studentClass: { id: 1 } },
        relations: ['studentClass'],
        order: { created_at: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a historical record', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockHistorical);
    });

    it('should throw NotFoundException if not found', async () => {
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a historical record', async () => {
      const dto = { subject: 'Física' };
      const result = await service.update(1, dto);
      expect(repo.save).toHaveBeenCalledWith({ ...mockHistorical, ...dto });
      expect(result).toEqual(mockHistorical);
    });

    it('should throw NotFoundException if studentClassId is invalid', async () => {
      const dto = { studentClassId: 999 };
      await expect(service.update(1, dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a historical record', async () => {
      const result = await service.remove(1);
      expect(repo.remove).toHaveBeenCalledWith(mockHistorical);
      expect(result).toEqual(mockHistorical);
    });

    it('should throw NotFoundException if not found', async () => {
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
