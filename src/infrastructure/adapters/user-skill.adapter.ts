import { Repository, DataSource } from 'typeorm';
import { IUserSkillRepository } from '../../domain/interfaces/user-skill.repository.interface';
import { UserSkill } from '../../domain/entities/user-skill.entity';
import { UserSkillSchema } from '../../database/schemas/user-skill.schema';

export class UserSkillAdapter implements IUserSkillRepository {
  private repository: Repository<UserSkillSchema>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserSkillSchema);
  }

  async findById(id: number): Promise<UserSkill | null> {
    const userSkillSchema = await this.repository.findOne({
      where: { id },
      relations: ['skill']
    });
    if (!userSkillSchema) return null;
    return this.toDomain(userSkillSchema);
  }

  async findByUserId(userId: number): Promise<UserSkill[]> {
    const userSkillSchemas = await this.repository.find({
      where: { userId },
      relations: ['skill'],
      order: { createdAt: 'DESC' }
    });
    return userSkillSchemas.map(schema => this.toDomain(schema));
  }

  async findBySkillId(skillId: number): Promise<UserSkill[]> {
    const userSkillSchemas = await this.repository.find({
      where: { skillId },
      relations: ['user']
    });
    return userSkillSchemas.map(schema => this.toDomain(schema));
  }

  async findByUserIdAndSkillId(userId: number, skillId: number): Promise<UserSkill | null> {
    const userSkillSchema = await this.repository.findOne({
      where: { userId, skillId }
    });
    if (!userSkillSchema) return null;
    return this.toDomain(userSkillSchema);
  }

  async create(userSkill: UserSkill): Promise<UserSkill> {
    const userSkillSchema = this.toSchema(userSkill);
    const saved = await this.repository.save(userSkillSchema);
    return this.toDomain(saved);
  }

  async update(userSkill: UserSkill): Promise<UserSkill> {
    const userSkillSchema = this.toSchema(userSkill);
    await this.repository.save(userSkillSchema);
    return userSkill;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.repository.delete({ userId });
  }

  async deleteByUserIdAndSkillId(userId: number, skillId: number): Promise<void> {
    await this.repository.delete({ userId, skillId });
  }

  private toDomain(schema: UserSkillSchema): UserSkill {
    return new UserSkill(
      schema.id,
      schema.userId,
      schema.skillId,
      schema.proficiencyLevel,
      schema.yearsOfExperience,
      schema.createdAt,
      schema.updatedAt
    );
  }

private toSchema(userSkill: UserSkill): UserSkillSchema {
  const schema = new UserSkillSchema();
  schema.id = userSkill.id;
  schema.userId = userSkill.userId;
  schema.skillId = userSkill.skillId;
  schema.proficiencyLevel = userSkill.proficiencyLevel ?? null;
  schema.yearsOfExperience = userSkill.yearsOfExperience ?? null; 
  schema.createdAt = userSkill.createdAt;
  schema.updatedAt = userSkill.updatedAt;
  return schema;
}

}