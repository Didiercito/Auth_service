import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { UserSchema } from './user.schema';

@Entity('User_Reputation_History')
@Index('IDX_USER_REPUTATION_HISTORY_USER', ['userId'])
@Index('IDX_USER_REPUTATION_HISTORY_DATE', ['createdAt'])
export class UserReputationHistorySchema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', name: 'user_id' })
  userId!: number;

  @Column({ type: 'int', name: 'change_amount', comment: 'Can be positive or negative' })
  changeAmount!: number;

  @Column({ type: 'int', name: 'previous_score' })
  previousScore!: number;

  @Column({ type: 'int', name: 'new_score' })
  newScore!: number;

  @Column({ type: 'varchar', length: 100 })
  reason!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  details!: string | null;

  @Column({ type: 'int', nullable: true, name: 'related_event_id', comment: 'Reference to external event service' })
  relatedEventId!: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'int', nullable: true, name: 'created_by' })
  createdBy!: number | null;

  @ManyToOne(() => UserSchema, user => user.reputationHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserSchema;
}