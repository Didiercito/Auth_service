import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index
} from 'typeorm';
import { UserRoleSchema } from './user-role.schema';
import { UserSkillSchema } from './user-skill.schema';
import { UserAvailabilitySchema } from './user-availability.schema';
import { UserScheduleSchema } from './user-schedule.schema';
import { UserReputationHistorySchema } from './user-reputation-history.schema';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

@Entity('Users')
@Index('IDX_USER_EMAIL', ['email'], { unique: true })
@Index('IDX_USER_STATUS', ['status'])
@Index('IDX_USER_LOCATION', ['stateId', 'municipalityId'])
export class UserSchema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 255 })
  names!: string;

  @Column({ type: 'varchar', length: 255, name: 'first_last_name' })
  firstLastName!: string;

  @Column({ type: 'varchar', length: 255, name: 'second_last_name' })
  secondLastName!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'image_profile' })
  imageProfile!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'phone_number' })
  phoneNumber!: string | null;

  @Column({ type: 'int', nullable: true, name: 'state_id' })
  stateId!: number | null;

  @Column({ type: 'int', nullable: true, name: 'municipality_id' })
  municipalityId!: number | null;

  @Column({ type: 'boolean', default: false, name: 'verified_email' })
  verifiedEmail!: boolean;

  @Column({ type: 'boolean', default: false, name: 'verified_phone' })
  verifiedPhone!: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'email_verified_at' })
  emailVerifiedAt!: Date | null;

  @Column({ type: 'timestamp', nullable: true, name: 'phone_verified_at' })
  phoneVerifiedAt!: Date | null;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status!: UserStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, name: 'reputation_score' })
  reputationScore!: number;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true, name: 'google_user_id' })
  googleUserId!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'int', nullable: true, name: 'created_by' })
  createdBy!: number | null;

  @OneToMany(() => UserRoleSchema, userRole => userRole.user)
  userRoles!: UserRoleSchema[];

  @OneToMany(() => UserSkillSchema, userSkill => userSkill.user)
  userSkills!: UserSkillSchema[];

  @OneToMany(() => UserAvailabilitySchema, availability => availability.user)
  availability!: UserAvailabilitySchema[];

  @OneToMany(() => UserScheduleSchema, schedule => schedule.user)
  schedules!: UserScheduleSchema[];

  @OneToMany(() => UserReputationHistorySchema, history => history.user)
  reputationHistory!: UserReputationHistorySchema[];
}