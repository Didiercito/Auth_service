import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDate,
  IsString,
  Matches
} from 'class-validator';

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}

export class UserAvailability {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime must be in format HH:mm'
  })
  startTime: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'endTime must be in format HH:mm'
  })
  endTime: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  constructor(
    id: number,
    userId: number,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}