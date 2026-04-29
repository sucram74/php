import { IsEmail, IsOptional, IsString } from 'class-validator';
export class UpdateConsumerDto { @IsOptional() @IsString() name?: string; @IsOptional() @IsString() phone?: string; @IsOptional() @IsEmail() email?: string; }
