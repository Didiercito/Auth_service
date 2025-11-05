import { UserSkill } from '../entities/user-skill.entity';

export interface IUserSkillRepository {
  findById(id: number): Promise<UserSkill | null>;
  findByUserId(userId: number): Promise<UserSkill[]>;
  findBySkillId(skillId: number): Promise<UserSkill[]>;
  findByUserIdAndSkillId(userId: number, skillId: number): Promise<UserSkill | null>;
  create(userSkill: UserSkill): Promise<UserSkill>;
  update(userSkill: UserSkill): Promise<UserSkill>;
  delete(id: number): Promise<void>;
  deleteByUserId(userId: number): Promise<void>;
  deleteByUserIdAndSkillId(userId: number, skillId: number): Promise<void>;
}