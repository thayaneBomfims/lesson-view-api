import { IsEnum, IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { ClassType } from '../class.entity';

export class CreateClassDto {
    @IsEnum(ClassType)
    type: ClassType;

    @IsNotEmpty()
    @IsString()
    service: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;
}
