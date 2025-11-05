import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
  Length
} from 'class-validator';

export class Skill {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @IsOptional()
  @Length(0, 500)
  description?: string | null;

  @IsBoolean()
  isActive: boolean;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsNumber()
  createdBy?: number | null;

  constructor(
    id: number,
    name: string,
    description: string | null,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    createdBy: number | null
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
  }
}