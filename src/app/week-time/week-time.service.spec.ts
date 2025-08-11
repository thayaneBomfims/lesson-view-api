import { Test, TestingModule } from '@nestjs/testing';
import { WeekTimeService } from './week-time.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WeekTime, WeekDay } from './week-time.entity';
import { Repository } from 'typeorm';

const weekTimeArray: WeekTime[] = [
    {
        id: 1,
        weekDay: WeekDay.SEGUNDA,
        time: '08:00',
        available: true,
    },
    {
        id: 2,
        weekDay: WeekDay.TERCA,
        time: '09:00',
        available: false,
    },
];

describe('WeekTimeService', () => {
    let service: WeekTimeService;
    let repo: Repository<WeekTime>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WeekTimeService,
                {
                    provide: getRepositoryToken(WeekTime),
                    useValue: {
                        create: jest.fn().mockImplementation(dto => dto),
                        save: jest.fn().mockResolvedValue(weekTimeArray[0]),
                        find: jest.fn().mockResolvedValue(weekTimeArray),
                        findOne: jest.fn().mockImplementation(({ where: { id } }) =>
                            weekTimeArray.find(w => w.id === id),
                        ),
                        update: jest.fn().mockResolvedValue({ affected: 1 }),
                        delete: jest.fn().mockResolvedValue({ affected: 1 }),
                    },
                },
            ],
        }).compile();

        service = module.get<WeekTimeService>(WeekTimeService);
        repo = module.get<Repository<WeekTime>>(getRepositoryToken(WeekTime));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a week time', async () => {
        const dto = {
            weekDay: WeekDay.SEGUNDA,
            time: '08:00',
            available: true,
        };
        const result = await service.create(dto);
        expect(repo.create).toHaveBeenCalledWith(dto);
        expect(repo.save).toHaveBeenCalledWith(dto);
        expect(result).toEqual(weekTimeArray[0]);
    });

    it('should find all week times without filters', async () => {
        const result = await service.findAll({});
        expect(repo.find).toHaveBeenCalledWith({
            where: {},
            order: { weekDay: 'ASC', time: 'ASC' },
        });
        expect(result).toEqual(weekTimeArray);
    });

    it('should find all week times filtered by weekDay', async () => {
        await service.findAll({ weekDay: WeekDay.SEGUNDA });
        expect(repo.find).toHaveBeenCalledWith({
            where: { weekDay: WeekDay.SEGUNDA },
            order: { weekDay: 'ASC', time: 'ASC' },
        });
    });

    it('should find all week times filtered by active', async () => {
        await service.findAll({ active: true });
        expect(repo.find).toHaveBeenCalledWith({
            where: { available: true },
            order: { weekDay: 'ASC', time: 'ASC' },
        });
    });

    it('should find one week time by ID', async () => {
        const result = await service.findOne(1);
        expect(result).toEqual(weekTimeArray[0]);
    });

    it('should update a week time', async () => {
        const dto = { available: false };
        const result = await service.update(1, dto);
        expect(repo.update).toHaveBeenCalledWith(1, dto);
        expect(result).toEqual(weekTimeArray[0]);
    });

    it('should delete a week time', async () => {
        const result = await service.delete(1);
        expect(repo.delete).toHaveBeenCalledWith(1);
        expect(result).toEqual({ affected: 1 });
    });
});
