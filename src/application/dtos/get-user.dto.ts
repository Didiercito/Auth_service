import {
  IsNotEmpty,
  IsNumber
} from 'class-validator';

export class GetUserDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }
}