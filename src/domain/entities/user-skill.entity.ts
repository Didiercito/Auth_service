import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDate,
  Min,
  Max
} from 'class-validator';

export class UserSkill {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  skillId: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  proficiencyLevel?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  yearsOfExperience?: number | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  constructor(
    id: number,
    userId: number,
    skillId: number,
    proficiencyLevel: number | null,
    yearsOfExperience: number | null,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.skillId = skillId;
    this.proficiencyLevel = proficiencyLevel;
    this.yearsOfExperience = yearsOfExperience;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}