import { IsEmail, IsOptional, IsString } from 'class-validator';
export class CreateConsumerDto { @IsString() cpf!: string; @IsString() name!: string; @IsString() phone!: string; @IsOptional() @IsEmail() email?: string; }
