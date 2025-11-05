import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDate,
  IsString,
  Length,
  Min,
  Max
} from 'class-validator';

export class UserReputationHistory {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(-100)
  @Max(100)
  changeAmount: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  previousScore: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  newScore: number;

  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  reason: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  details?: string | null;

  @IsOptional()
  @IsNumber()
  relatedEventId?: number | null;

  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsNumber()
  createdBy?: number | null;

  constructor(
    id: number,
    userId: number,
    changeAmount: number,
    previousScore: number,
    newScore: number,
    reason: string,
    details: string | null,
    relatedEventId: number | null,
    createdAt: Date,
    createdBy: number | null
  ) {
    this.id = id;
    this.userId = userId;
    this.changeAmount = changeAmount;
    this.previousScore = previousScore;
    this.newScore = newScore;
    this.reason = reason;
    this.details = details;
    this.relatedEventId = relatedEventId;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
  }
}