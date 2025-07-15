import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNumber()
    age: number;

    @IsNotEmpty()
    @IsString()
    contactNumber: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    googleCode?: string;
}
