import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum RegisterRole {
  CANDIDATE = 'CANDIDATE',
  INSTRUCTOR = 'INSTRUCTOR',
  SCHOOL_MANAGER = 'SCHOOL_MANAGER',
}

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(RegisterRole)
  role!: RegisterRole;
}
