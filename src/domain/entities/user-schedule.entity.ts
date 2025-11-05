import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDate,
  IsString,
  Length
} from 'class-validator';

export class UserSchedule {
  @IsOptional()
  @IsNumber()
  id: number;

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
  notes?: string | null;

  @IsOptional()
  @IsNumber()
  eventId?: number | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsNumber()
  createdBy?: number | null;

  constructor(
    id: number,
    userId: number,
    startDateTime: Date,
    endDateTime: Date,
    notes: string | null,
    eventId: number | null,
    createdAt: Date,
    updatedAt: Date,
    createdBy: number | null
  ) {
    this.id = id;
    this.userId = userId;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.notes = notes;
    this.eventId = eventId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
  }
}