import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { UserRole, UserStatus } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  cpf?: string;

  @IsString()
  @IsOptional()
  registration?: string;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @IsOptional()
  avatarId?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
