import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { Repository } from 'typeorm';

const studentArray = [
    {
        id: 1,
        name: 'Maria',
        age: 10,
        contactNumber: '11999999999',
        email: 'maria@example.com',
        googleCode: 'abc123',
    },
    {
        id: 2,
        name: 'João',
        age: 12,
        contactNumber: '11988888888',
        email: 'joao@example.com',
        googleCode: 'xyz456',
    },
];

describe('StudentsService', () => {
    let service: StudentsService;
    let repo: Repository<Student>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StudentsService,
                {
                    provide: getRepositoryToken(Student),
                    useValue: {
                        create: jest.fn().mockImplementation(dto => dto),
                        save: jest.fn().mockResolvedValue(studentArray[0]),
                        find: jest.fn().mockResolvedValue(studentArray),
                        findOne: jest.fn().mockImplementation(({ where: { id, googleCode } }) =>
                            studentArray.find(
                                s => s.id === id || s.googleCode === googleCode
                            )
                        ),
                        update: jest.fn().mockResolvedValue({ affected: 1 }),
                        delete: jest.fn().mockResolvedValue({ affected: 1 }),
                    },
                },
            ],
        }).compile();

        service = module.get<StudentsService>(StudentsService);
        repo = module.get<Repository<Student>>(getRepositoryToken(Student));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a student', async () => {
        const dto = {
            name: 'Maria',
            age: 10,
            contactNumber: '11999999999',
            email: 'maria@example.com',
            googleCode: 'abc123',
        };
        const result = await service.create(dto);
        expect(repo.create).toHaveBeenCalledWith(dto);
        expect(repo.save).toHaveBeenCalledWith(dto);
        expect(result).toEqual(studentArray[0]);
    });

    it('should find all students', async () => {
        const result = await service.findAll();
        expect(repo.find).toHaveBeenCalled();
        expect(result).toEqual(studentArray);
    });

    it('should find one student by ID', async () => {
        const result = await service.findOne(1);
        expect(result).toEqual(studentArray[0]);
    });

    it('should update a student', async () => {
        const dto = { name: 'Maria Atualizada' };
        const result = await service.update(1, dto);
        expect(repo.update).toHaveBeenCalledWith(1, dto);
        expect(result).toEqual(studentArray[0]);
    });

    it('should delete a student', async () => {
        const result = await service.delete(1);
        expect(repo.delete).toHaveBeenCalledWith(1);
        expect(result).toEqual({ affected: 1 });
    });

    it('should find a student by googleCode', async () => {
        const result = await service.findByGoogleCode('abc123');
        expect(result).toEqual(studentArray[0]);
    });
});
