import {
  IsEmail,
  IsNotEmpty,
  Length,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
  Min,
  Max
} from 'class-validator';
import { Role } from './role.entity';
import { UserSkill } from './user-skill.entity';
import { UserAvailability } from './user-availability.entity';
import { UserSchedule } from './user-schedule.entity';
import { UserReputationHistory } from './user-reputation-history.entity';
import { EmailVerification } from './email-verification.entity';
import { PhoneVerification } from './phone-verification.entity';
import { PasswordResetToken } from './password-reset-token.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export class User {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  passwordHash: string;

  @IsNotEmpty()
  @Length(2, 255)
  names: string;

  @IsNotEmpty()
  @Length(2, 255)
  firstLastName: string;

  @IsNotEmpty()
  @Length(2, 255)
  secondLastName: string;

  @IsOptional()
  imageProfile?: string | null;

  @IsOptional()
  @Length(10, 50)
  phoneNumber?: string | null;

  @IsOptional()
  @IsNumber()
  stateId?: number | null;

  @IsOptional()
  @IsNumber()
  municipalityId?: number | null;

  @IsBoolean()
  verifiedEmail: boolean;

  @IsBoolean()
  verifiedPhone: boolean;

  @IsOptional()
  @IsDate()
  emailVerifiedAt?: Date | null;

  @IsOptional()
  @IsDate()
  phoneVerifiedAt?: Date | null;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsNumber()
  @Min(0)
  @Max(100)
  reputationScore: number;

  @IsOptional()
  googleUserId?: string | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsNumber()
  createdBy?: number | null;

  roles?: Role[];

  userSkills?: UserSkill[];

  availability?: UserAvailability[];
  schedules?: UserSchedule[];

  reputationHistory?: UserReputationHistory[];

  emailVerifications?: EmailVerification[];
  phoneVerifications?: PhoneVerification[];

  passwordResetTokens?: PasswordResetToken[];

  constructor(
    id: number,
    names: string,
    firstLastName: string,
    secondLastName: string,
    email: string,
    passwordHash: string,
    imageProfile: string | null = null,
    phoneNumber: string | null = null,
    reputationScore: number = 0,
    googleUserId: string | null = null,
    status: UserStatus = UserStatus.PENDING,
    verifiedEmail: boolean = false,
    verifiedPhone: boolean = false,
    emailVerifiedAt: Date | null = null,
    phoneVerifiedAt: Date | null = null,
    stateId: number | null = null,
    municipalityId: number | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    createdBy: number | null = null
  ) {
    this.id = id;
    this.names = names;
    this.firstLastName = firstLastName;
    this.secondLastName = secondLastName;
    this.email = email;
    this.passwordHash = passwordHash;
    this.imageProfile = imageProfile;
    this.phoneNumber = phoneNumber;
    this.reputationScore = reputationScore;
    this.googleUserId = googleUserId;
    this.status = status;
    this.verifiedEmail = verifiedEmail;
    this.verifiedPhone = verifiedPhone;
    this.emailVerifiedAt = emailVerifiedAt;
    this.phoneVerifiedAt = phoneVerifiedAt;
    this.stateId = stateId;
    this.municipalityId = municipalityId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
  }
}