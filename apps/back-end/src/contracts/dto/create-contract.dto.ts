import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateContractDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string | Date;

  @IsDateString()
  @IsOptional()
  endDate?: string | Date;

  @IsString()
  @IsOptional()
  status?: string;
}
