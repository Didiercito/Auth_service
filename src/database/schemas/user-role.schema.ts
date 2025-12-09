import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { UserSchema } from './user.schema';
import { RoleSchema } from './role.schema';

@Entity('User_Roles')
export class UserRoleSchema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', name: 'user_id' })
  userId!: number;

  @Column({ type: 'int', name: 'role_id' })
  roleId!: number;

  @Column({ type: 'boolean', default: false, name: 'is_primary' })
  isPrimary!: boolean;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt!: Date;

  @Column({ type: 'int', nullable: true, name: 'assigned_by' })
  assignedBy!: number | null;

  @ManyToOne(() => UserSchema, user => user.userRoles, {onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserSchema;

  @ManyToOne(() => RoleSchema, role => role.userRoles)
  @JoinColumn({ name: 'role_id' })
  role!: RoleSchema;
}
