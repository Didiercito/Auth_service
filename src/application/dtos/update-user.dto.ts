import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsEmail,
  IsEnum,
  Length,
  Min,
  Max
} from 'class-validator';
import { UserStatus } from '../../domain/entities/user.entity';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  names?: string;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  firstLastName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  secondLastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(10, 50)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  imageProfile?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  reputationScore?: number;

  @IsOptional()
  @IsNumber()
  stateId?: number;

  @IsOptional()
  @IsNumber()
  municipalityId?: number;

  constructor(
    userId: number,
    names?: string,
    firstLastName?: string,
    secondLastName?: string,
    email?: string,
    phoneNumber?: string,
    imageProfile?: string,
    status?: UserStatus,
    reputationScore?: number,
    stateId?: number,
    municipalityId?: number
  ) {
    this.userId = userId;
    this.names = names;
    this.firstLastName = firstLastName;
    this.secondLastName = secondLastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.imageProfile = imageProfile;
    this.status = status;
    this.reputationScore = reputationScore;
    this.stateId = stateId;
    this.municipalityId = municipalityId;
  }
}