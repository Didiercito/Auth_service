import {
  IsNotEmpty,
  IsNumber
} from 'class-validator';

export class GetUserSkillsDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }
}