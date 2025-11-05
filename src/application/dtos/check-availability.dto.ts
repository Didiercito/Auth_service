
import {
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional
} from 'class-validator';
import { DayOfWeek } from '../../domain/entities/user-availability.entity';

export class CheckAvailabilityDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsDate()
  startDateTime: Date;

  @IsNotEmpty()
  @IsDate()
  endDateTime: Date;

  @IsOptional()
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek;

  constructor(
    userId: number,
    startDateTime: Date,
    endDateTime: Date,
    dayOfWeek?: DayOfWeek
  ) {
    this.userId = userId;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.dayOfWeek = dayOfWeek;
  }
}