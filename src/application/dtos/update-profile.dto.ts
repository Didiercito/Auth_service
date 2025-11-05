import {
    IsNumber,
  IsOptional,
  IsString,
  Length
} from 'class-validator';

export class UpdateProfileDto {
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
  @IsString()
  @Length(10, 50)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  imageProfile?: string;

  @IsOptional()
  @IsNumber()
  stateId?: number;

  @IsOptional()
  @IsNumber()
  municipalityId?: number;

  constructor(
    names?: string,
    firstLastName?: string,
    secondLastName?: string,
    phoneNumber?: string,
    imageProfile?: string,
    stateId?: number,
    municipalityId?: number
  ) {
    this.names = names;
    this.firstLastName = firstLastName;
    this.secondLastName = secondLastName;
    this.phoneNumber = phoneNumber;
    this.imageProfile = imageProfile;
    this.stateId = stateId;
    this.municipalityId = municipalityId;
  }
}