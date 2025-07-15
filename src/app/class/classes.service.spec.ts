import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassesService } from './classes.service';
import { Class, ClassType } from './class.entity';

const classArray = [
    {
        id: 1,
        service: 'Programação de Software',
        price: 45.00,
        type: ClassType.VIRTUAL
    },
    {
        id: 2,
        service: 'Engenharia de projetos',
        price: 85.00,
        type: ClassType.DOMICILIO
    },
];

describe('ClassesService', () => {
    let service: ClassesService;
    let repo: Repository<Class>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ClassesService,
                {
                    provide: getRepositoryToken(Class),
                    useValue: {
                        create: jest.fn().mockImplementation(dto => dto),
                        save: jest.fn().mockResolvedValue(classArray[0]),
                        find: jest.fn().mockResolvedValue(classArray),
                        findOne: jest.fn().mockImplementation(({ where: { id } }) =>
                            classArray.find(
                                s => s.id === id
                            )
                        ),
                        update: jest.fn().mockResolvedValue({ affected: 1 }),
                        delete: jest.fn().mockResolvedValue({ affected: 1 }),
                    },
                },
            ],
        }).compile();

        service = module.get<ClassesService>(ClassesService);
        repo = module.get<Repository<Class>>(getRepositoryToken(Class));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a class', async () => {
        const dto = {
            service: 'Programação de Software',
            price: 45.00,
            type: ClassType.VIRTUAL
        };
        const result = await service.create(dto);
        expect(repo.create).toHaveBeenCalledWith(dto);
        expect(repo.save).toHaveBeenCalledWith(dto);
        expect(result).toEqual(classArray[0]);
    });

    it('should find all classes', async () => {
        const result = await service.findAll();
        expect(repo.find).toHaveBeenCalled();
        expect(result).toEqual(classArray);
    });

    it('should find one class by ID', async () => {
        const result = await service.findOne(1);
        expect(result).toEqual(classArray[0]);
    });

    it('should update a class', async () => {
        const dto = { price: 45.00 };
        const result = await service.update(1, dto);
        expect(repo.update).toHaveBeenCalledWith(1, dto);

        console.log('result', result)
        console.log('class', classArray[0])

        expect(result).toEqual(classArray[0]);
    });

    it('should delete a class', async () => {
        const result = await service.delete(1);
        expect(repo.delete).toHaveBeenCalledWith(1);
        expect(result).toEqual({ affected: 1 });
    });
});
