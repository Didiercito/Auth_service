import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum
} from 'class-validator';
import { DayOfWeek } from '../../domain/entities/user-availability.entity';

export class GetUserAvailabilityDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek;

  constructor(userId: number, dayOfWeek?: DayOfWeek) {
    this.userId = userId;
    this.dayOfWeek = dayOfWeek;
  }
}