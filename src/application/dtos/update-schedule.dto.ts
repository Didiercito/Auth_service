import {
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsOptional,
  IsString,
  Length
} from 'class-validator';

export class UpdateScheduleDto {
  @IsNotEmpty()
  @IsNumber()
  scheduleId: number;

  @IsOptional()
  @IsDate()
  startDateTime?: Date;

  @IsOptional()
  @IsDate()
  endDateTime?: Date;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;

  @IsOptional()
  @IsNumber()
  eventId?: number;

  constructor(
    scheduleId: number,
    startDateTime?: Date,
    endDateTime?: Date,
    notes?: string,
    eventId?: number
  ) {
    this.scheduleId = scheduleId;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.notes = notes;
    this.eventId = eventId;
  }
}