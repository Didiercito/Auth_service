import {
  IsOptional,
  IsBoolean,
  IsString,
  IsNumber,
  Min
} from 'class-validator';

export class GetSkillsDto {
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
  @IsBoolean()
  isActive?: boolean;

  constructor(
    page?: number,
    limit?: number,
    search?: string,
    isActive?: boolean
  ) {
    this.page = page || 1;
    this.limit = limit || 50;
    this.search = search;
    this.isActive = isActive !== undefined ? isActive : true;
  }
}