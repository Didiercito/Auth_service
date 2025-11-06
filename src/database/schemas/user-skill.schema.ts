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
import { SkillSchema } from './skill.schema';

@Entity('User_Skills')
@Index('IDX_USER_SKILL_UNIQUE', ['userId', 'skillId'], { unique: true })
export class UserSkillSchema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', name: 'user_id' })
  userId!: number;

  @Column({ type: 'int', name: 'skill_id' })
  skillId!: number;

  @Column({ type: 'int', nullable: true, name: 'proficiency_level', comment: 'Level from 1 to 5' })
  proficiencyLevel!: number | null;

  @Column({ type: 'int', nullable: true, name: 'years_of_experience' })
  yearsOfExperience!: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => UserSchema, user => user.userSkills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserSchema;

  @ManyToOne(() => SkillSchema, skill => skill.userSkills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skill_id' })
  skill!: SkillSchema;
}