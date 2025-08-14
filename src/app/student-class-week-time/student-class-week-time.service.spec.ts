import { Test, TestingModule } from '@nestjs/testing';
import { StudentClassWeekTimeService } from './student-class-week-time.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentClassWeekTime } from './student-class-week-time.entity';
import { StudentClass } from '../student-class/student-class.entity';
import { WeekTime } from '../week-time/week-time.entity';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

const mockRepo = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  }),
});

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('StudentClassWeekTimeService', () => {
  let service: StudentClassWeekTimeService;
  let repo: MockRepo<StudentClassWeekTime>;
  let scRepo: MockRepo<StudentClass>;
  let wtRepo: MockRepo<WeekTime>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentClassWeekTimeService,
        { provide: getRepositoryToken(StudentClassWeekTime), useFactory: mockRepo },
        { provide: getRepositoryToken(StudentClass), useFactory: mockRepo },
        { provide: getRepositoryToken(WeekTime), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<StudentClassWeekTimeService>(StudentClassWeekTimeService);
    repo = module.get(getRepositoryToken(StudentClassWeekTime));
    scRepo = module.get(getRepositoryToken(StudentClass));
    wtRepo = module.get(getRepositoryToken(WeekTime));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = { studentClassId: 1, weekTimeId: 2 };

    it('should create a link successfully', async () => {
      const studentClass = { id: 1 } as StudentClass;
      const weekTime = { id: 2, available: true } as WeekTime;

      scRepo.findOne.mockResolvedValue(studentClass);
      wtRepo.findOne.mockResolvedValue(weekTime);
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue({ studentClass, weekTime });
      repo.save.mockResolvedValue({ id: 10, studentClass, weekTime });
      wtRepo.save.mockResolvedValue({ ...weekTime, available: false });

      const result = await service.create(dto);

      expect(wtRepo.save).toHaveBeenCalledWith(expect.objectContaining({ available: false }));
      expect(repo.create).toHaveBeenCalledWith({ studentClass, weekTime });
      expect(result).toEqual({ id: 10, studentClass, weekTime });
    });

    it('should throw NotFoundException if studentClass does not exist', async () => {
      scRepo.findOne.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if weekTime does not exist', async () => {
      scRepo.findOne.mockResolvedValue({ id: 1 });
      wtRepo.findOne.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if weekTime is unavailable', async () => {
      scRepo.findOne.mockResolvedValue({ id: 1 });
      wtRepo.findOne.mockResolvedValue({ id: 2, available: false });
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if link already exists', async () => {
      scRepo.findOne.mockResolvedValue({ id: 1 });
      wtRepo.findOne.mockResolvedValue({ id: 2, available: true });
      repo.findOne.mockResolvedValue({ id: 99 });
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return the link if found', async () => {
      repo.findOne.mockResolvedValue({ id: 1 });
      const result = await service.findOne(1);
      expect(result).toEqual({ id: 1 });
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete successfully', async () => {
      repo.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result).toEqual({ deleted: true });
    });

    it('should throw NotFoundException if nothing deleted', async () => {
      repo.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove(123)).rejects.toThrow(NotFoundException);
    });
  });
});
