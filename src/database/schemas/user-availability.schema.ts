import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { UserSchema } from './user.schema';

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}

@Entity('User_Availability')
@Index('IDX_USER_AVAILABILITY_USER_DAY', ['userId', 'dayOfWeek'])
export class UserAvailabilitySchema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', name: 'user_id' })
  userId!: number;

  @Column({ type: 'enum', enum: DayOfWeek, name: 'day_of_week' })
  dayOfWeek!: DayOfWeek;

  @Column({ type: 'varchar', length: 5, name: 'start_time', comment: 'Format HH:mm' })
  startTime!: string;

  @Column({ type: 'varchar', length: 5, name: 'end_time', comment: 'Format HH:mm' })
  endTime!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => UserSchema, user => user.availability, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserSchema;
}