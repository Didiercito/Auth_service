import {
  IsNotEmpty,
  IsNumber
} from 'class-validator';

export class RemoveSkillDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  skillId: number;

  constructor(userId: number, skillId: number) {
    this.userId = userId;
    this.skillId = skillId;
  }
}