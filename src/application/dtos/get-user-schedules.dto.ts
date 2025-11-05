import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDate,
  Min
} from 'class-validator';

export class GetUserSchedulesDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  eventId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  constructor(
    userId: number,
    startDate?: Date,
    endDate?: Date,
    eventId?: number,
    page?: number,
    limit?: number
  ) {
    this.userId = userId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.eventId = eventId;
    this.page = page || 1;
    this.limit = limit || 20;
  }
}