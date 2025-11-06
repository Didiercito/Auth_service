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

@Entity('User_Schedules')
@Index('IDX_USER_SCHEDULE_USER_DATETIME', ['userId', 'startDateTime', 'endDateTime'])
@Index('IDX_USER_SCHEDULE_EVENT', ['eventId'])
export class UserScheduleSchema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', name: 'user_id' })
  userId!: number;

  @Column({ type: 'timestamp', name: 'start_date_time' })
  startDateTime!: Date;

  @Column({ type: 'timestamp', name: 'end_date_time' })
  endDateTime!: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  notes!: string | null;

  @Column({ type: 'int', nullable: true, name: 'event_id', comment: 'Reference to external event service' })
  eventId!: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'int', nullable: true, name: 'created_by' })
  createdBy!: number | null;

  @ManyToOne(() => UserSchema, user => user.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserSchema;
}