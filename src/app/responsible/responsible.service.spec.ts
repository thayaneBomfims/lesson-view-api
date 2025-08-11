import { Test, TestingModule } from '@nestjs/testing';
import { ResponsibleService } from './responsible.service';
import { Responsible } from './responsible.entity';
import { Student } from '../students/student.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeekDay } from '../week-time/week-time.entity';

const studentMock: Student = {
  id: 1,
  name: 'Maria',
  age: 10,
  contactNumber: '11999999999',
  email: 'maria@example.com',
  googleCode: 'abc123',
  responsibles: [],
};

const responsibleArray: Responsible[] = [
  {
    id: 1,
    name: 'Responsável 1',
    contactNumber: '11911111111',
    contactEmail: 'resp1@example.com',
    student: studentMock,
  },
  {
    id: 2,
    name: 'Responsável 2',
    contactNumber: '11922222222',
    contactEmail: 'resp2@example.com',
    student: studentMock,
  },
];

describe('ResponsibleService', () => {
  let service: ResponsibleService;
  let responsibleRepo: Repository<Responsible>;
  let studentRepo: Repository<Student>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponsibleService,
        {
          provide: getRepositoryToken(Responsible),
          useValue: {
            create: jest.fn().mockImplementation(dto => dto),
            save: jest.fn().mockResolvedValue(responsibleArray[0]),
            find: jest.fn().mockResolvedValue(responsibleArray),
            findOne: jest.fn().mockImplementation(({ where: { id } }) =>
              responsibleArray.find(r => r.id === id),
            ),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: getRepositoryToken(Student),
          useValue: {
            findOne: jest.fn().mockResolvedValue(studentMock),
          },
        },
      ],
    }).compile();

    service = module.get<ResponsibleService>(ResponsibleService);
    responsibleRepo = module.get<Repository<Responsible>>(getRepositoryToken(Responsible));
    studentRepo = module.get<Repository<Student>>(getRepositoryToken(Student));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a responsible when student exists', async () => {
      const dto = {
        name: 'Responsável 1',
        contactNumber: '11911111111',
        contactEmail: 'resp1@example.com',
        studentId: 1,
      };
      const result = await service.create(dto);
      expect(studentRepo.findOne).toHaveBeenCalledWith({ where: { id: dto.studentId } });
      expect(responsibleRepo.create).toHaveBeenCalled();
      expect(responsibleRepo.save).toHaveBeenCalled();
      expect(result).toEqual(responsibleArray[0]);
    });

    it('should throw an error if student not found', async () => {
      jest.spyOn(studentRepo, 'findOne').mockResolvedValueOnce(null);
      const dto = {
        name: 'Responsável X',
        contactNumber: '11900000000',
        contactEmail: 'respX@example.com',
        studentId: 99,
      };
      await expect(service.create(dto)).rejects.toThrow('Student not found');
    });
  });

  describe('findAll', () => {
    it('should find all responsibles without filter', async () => {
      const result = await service.findAll();
      expect(responsibleRepo.find).toHaveBeenCalledWith({
        where: {},
        relations: ['student'],
        order: { name: 'ASC' },
      });
      expect(result).toEqual(responsibleArray);
    });

    it('should find all responsibles filtered by student_id', async () => {
      await service.findAll(1);
      expect(responsibleRepo.find).toHaveBeenCalledWith({
        where: { student: { id: 1 } },
        relations: ['student'],
        order: { name: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should find a responsible by ID', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(responsibleArray[0]);
    });
  });

  describe('update', () => {
    it('should update a responsible without changing student', async () => {
      const dto = { name: 'Novo Nome' };
      const result = await service.update(1, dto);
      expect(responsibleRepo.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(responsibleArray[0]);
    });

    it('should update a responsible with new student', async () => {
      const dto = { studentId: 1 };
      const result = await service.update(1, dto);
      expect(studentRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(responsibleRepo.update).toHaveBeenCalled();
      expect(result).toEqual(responsibleArray[0]);
    });

    it('should throw error if updating with non-existing student', async () => {
      jest.spyOn(studentRepo, 'findOne').mockResolvedValueOnce(null);
      const dto = { studentId: 99 };
      await expect(service.update(1, dto)).rejects.toThrow('Student not found');
    });
  });

  describe('delete', () => {
    it('should delete a responsible', async () => {
      const result = await service.delete(1);
      expect(responsibleRepo.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
