import { DocumentType, DocumentStatus } from '@prisma/client';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(DocumentType)
  @IsOptional()
  type?: DocumentType;

  @IsEnum(DocumentStatus)
  @IsOptional()
  status?: DocumentStatus;

  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsString()
  @IsNotEmpty()
  uploadId: string;

  @IsOptional()
  ocrData?: any;
}
