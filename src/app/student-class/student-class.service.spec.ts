import { Test, TestingModule } from '@nestjs/testing';
import { StudentClassService } from './student-class.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StudentClass, StudentStatus } from './student-class.entity';
import { Student } from '../students/student.entity';
import { Class, ClassType } from '../class/class.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const studentMock: Student = {
  id: 1,
  name: 'Maria',
  age: 10,
  contactNumber: '11999999999',
  email: 'maria@example.com',
  googleCode: 'abc123',
  responsibles: [],
  studentClasses: [],
};

const classMock: Class = {
  id: 1,
  type: ClassType.VIRTUAL,
  service: 'Test Service',
  price: 100.00,
  studentClasses: [],
};
const studentClassMock = {
  id: 1,
  student: studentMock,
  class: classMock,
  studentStatus: 'beginner',
  created_at: new Date(),
} as StudentClass;

describe('StudentClassService', () => {
  let service: StudentClassService;
  let repo: Repository<StudentClass>;
  let studentRepo: Repository<Student>;
  let classRepo: Repository<Class>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentClassService,
        {
          provide: getRepositoryToken(StudentClass),
          useValue: {
            create: jest.fn().mockReturnValue(studentClassMock),
            save: jest.fn().mockResolvedValue(studentClassMock),
            find: jest.fn().mockResolvedValue([studentClassMock]),
            findOne: jest.fn().mockResolvedValue(studentClassMock),
            findOneBy: jest.fn().mockResolvedValue(studentClassMock),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: getRepositoryToken(Student),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(studentMock),
          },
        },
        {
          provide: getRepositoryToken(Class),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(classMock),
          },
        },
      ],
    }).compile();

    service = module.get<StudentClassService>(StudentClassService);
    repo = module.get<Repository<StudentClass>>(getRepositoryToken(StudentClass));
    studentRepo = module.get<Repository<Student>>(getRepositoryToken(Student));
    classRepo = module.get<Repository<Class>>(getRepositoryToken(Class));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a student class', async () => {
    const dto = { studentId: 1, classId: 1, studentStatus: StudentStatus.BEGINNER };
    const result = await service.create(dto);
    expect(studentRepo.findOneBy).toHaveBeenCalledWith({ id: dto.studentId });
    expect(classRepo.findOneBy).toHaveBeenCalledWith({ id: dto.classId });
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual(studentClassMock);
  });

  it('should throw NotFoundException if student not found', async () => {
    (studentRepo.findOneBy as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = { studentId: 99, classId: 1, studentStatus: StudentStatus.BEGINNER };
    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if class not found', async () => {
    (classRepo.findOneBy as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = { studentId: 1, classId: 99, studentStatus: StudentStatus.BEGINNER };
    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
  });

  it('should find all student classes', async () => {
    const result = await service.findAll();
    expect(repo.find).toHaveBeenCalled();
    expect(result).toEqual([studentClassMock]);
  });

  it('should find one student class', async () => {
    const result = await service.findOne(1);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['student', 'class'],
    });
    expect(result).toEqual(studentClassMock);
  });

  it('should update a student class', async () => {
    const dto = { studentStatus: StudentStatus.ADVANCED };
    (repo.findOneBy as jest.Mock).mockResolvedValueOnce(studentClassMock);
    (repo.save as jest.Mock).mockResolvedValueOnce({ ...studentClassMock, ...dto });
    const result = await service.update(1, dto);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repo.save).toHaveBeenCalled();
    expect(result.studentStatus).toBe('advanced');
  });

  it('should throw NotFoundException on update if not found', async () => {
    (repo.findOneBy as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.update(99, { studentStatus: StudentStatus.ADVANCED })).rejects.toThrow(NotFoundException);
  });

  it('should remove a student class', async () => {
    const result = await service.remove(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ deleted: true });
  });

  it('should throw NotFoundException on remove if not found', async () => {
    (repo.delete as jest.Mock).mockResolvedValueOnce({ affected: 0 });
    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
  });
});
