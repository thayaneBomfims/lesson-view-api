import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';

export class CreateResponsibleDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    contactNumber: string;

    @IsNotEmpty()
    @IsEmail()
    contactEmail: string;

    @IsNotEmpty()
    @IsNumber()
    studentId: number;
}
