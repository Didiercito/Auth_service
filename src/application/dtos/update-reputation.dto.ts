import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Length,
  Min,
  Max
} from 'class-validator';

export class UpdateReputationDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(-100)
  @Max(100)
  changeAmount: number;

  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  reason: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  details?: string;

  @IsOptional()
  @IsNumber()
  relatedEventId?: number;

  @IsOptional()
  @IsNumber()
  createdBy?: number;

  constructor(
    userId: number,
    changeAmount: number,
    reason: string,
    details?: string,
    relatedEventId?: number,
    createdBy?: number
  ) {
    this.userId = userId;
    this.changeAmount = changeAmount;
    this.reason = reason;
    this.details = details;
    this.relatedEventId = relatedEventId;
    this.createdBy = createdBy;
  }
}