import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max
} from 'class-validator';

export class AddSkillDto {
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
  proficiencyLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  yearsOfExperience?: number;

  constructor(
    userId: number,
    skillId: number,
    proficiencyLevel?: number,
    yearsOfExperience?: number
  ) {
    this.userId = userId;
    this.skillId = skillId;
    this.proficiencyLevel = proficiencyLevel;
    this.yearsOfExperience = yearsOfExperience;
  }
}