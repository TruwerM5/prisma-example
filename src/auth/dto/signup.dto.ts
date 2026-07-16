import { IsString, IsEmail, Min } from 'class-validator';

export class SignUpDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @Min(10)
    password: string;
}