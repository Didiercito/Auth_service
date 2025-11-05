import {
  IsOptional,
  IsNumber,
  IsString,
  Min,
  IsEnum
} from 'class-validator';
import { UserStatus } from '../../domain/entities/user.entitie';

export class GetUsersPaginatedDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsNumber()
  stateId?: number;

  @IsOptional()
  @IsNumber()
  municipalityId?: number;

  constructor(
    page?: number,
    limit?: number,
    search?: string,
    status?: UserStatus,
    stateId?: number,
    municipalityId?: number
  ) {
    this.page = page || 1;
    this.limit = limit || 10;
    this.search = search;
    this.status = status;
    this.stateId = stateId;
    this.municipalityId = municipalityId;
  }
}