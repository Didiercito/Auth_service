import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
  IsString,
  Matches
} from 'class-validator';
import { Type } from 'class-transformer';
import { DayOfWeek } from '../../domain/entities/user-availability.entity';

export class AvailabilitySlotDto {
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

  constructor(dayOfWeek: DayOfWeek, startTime: string, endTime: string) {
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}

export class SetAvailabilityDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  availabilitySlots: AvailabilitySlotDto[];

  constructor(userId: number, availabilitySlots: AvailabilitySlotDto[]) {
    this.userId = userId;
    this.availabilitySlots = availabilitySlots;
  }
}