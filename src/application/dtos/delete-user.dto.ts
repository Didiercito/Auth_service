import {
  IsNotEmpty,
  IsNumber
} from 'class-validator';

export class DeleteUserDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }
}