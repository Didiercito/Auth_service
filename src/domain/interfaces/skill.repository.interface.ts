import { Skill } from '../entities/skill.entity';

export interface ISkillRepository {
  findById(id: number): Promise<Skill | null>;
  findByName(name: string): Promise<Skill | null>;
  findAll(): Promise<Skill[]>;
  findPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    isActive?: boolean;
  }): Promise<{ data: Skill[]; total: number }>;
  create(skill: Skill): Promise<Skill>;
  update(skill: Skill): Promise<Skill>;
  delete(id: number): Promise<void>;
}