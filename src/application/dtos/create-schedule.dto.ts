import {
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsOptional,
  IsString,
  Length
} from 'class-validator';

export class CreateScheduleDto {
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
  @IsString()
  @Length(0, 500)
  notes?: string;

  @IsOptional()
  @IsNumber()
  eventId?: number;

  @IsOptional()
  @IsNumber()
  createdBy?: number;

  constructor(
    userId: number,
    startDateTime: Date,
    endDateTime: Date,
    notes?: string,
    eventId?: number,
    createdBy?: number
  ) {
    this.userId = userId;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.notes = notes;
    this.eventId = eventId;
    this.createdBy = createdBy;
  }
}