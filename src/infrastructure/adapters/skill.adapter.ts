import { Repository, DataSource, Like } from 'typeorm';
import { ISkillRepository } from '../../domain/interfaces/skill.repository.interface';
import { Skill } from '../../domain/entities/skill.entity';
import { SkillSchema } from '../../database/schemas/skill.schema';

export class SkillAdapter implements ISkillRepository {
  private repository: Repository<SkillSchema>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(SkillSchema);
  }

  async findById(id: number): Promise<Skill | null> {
    const skillSchema = await this.repository.findOne({ where: { id } });
    if (!skillSchema) return null;
    return this.toDomain(skillSchema);
  }

  async findByName(name: string): Promise<Skill | null> {
    const skillSchema = await this.repository.findOne({ where: { name } });
    if (!skillSchema) return null;
    return this.toDomain(skillSchema);
  }

  async findAll(): Promise<Skill[]> {
    const skillSchemas = await this.repository.find();
    return skillSchemas.map(schema => this.toDomain(schema));
  }

  async findPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    isActive?: boolean;
  }): Promise<{ data: Skill[]; total: number }> {
    const { page, limit, search, isActive } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.name = Like(`%${search}%`);
    }

    const [skillSchemas, total] = await this.repository.findAndCount({
      where,
      skip,
      take: limit,
      order: { name: 'ASC' }
    });

    const data = skillSchemas.map(schema => this.toDomain(schema));

    return { data, total };
  }

  async create(skill: Skill): Promise<Skill> {
    const skillSchema = this.toSchema(skill);
    const saved = await this.repository.save(skillSchema);
    return this.toDomain(saved);
  }

  async update(skill: Skill): Promise<Skill> {
    const skillSchema = this.toSchema(skill);
    await this.repository.save(skillSchema);
    return skill;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(schema: SkillSchema): Skill {
    return new Skill(
      schema.id,
      schema.name,
      schema.description,
      schema.isActive,
      schema.createdAt,
      schema.updatedAt,
      schema.createdBy
    );
  }

  private toSchema(skill: Skill): SkillSchema {
    const schema = new SkillSchema();
    schema.id = skill.id;
    schema.name = skill.name;
    schema.description = skill.description || '';
    schema.isActive = skill.isActive;
    schema.createdAt = skill.createdAt;
    schema.updatedAt = skill.updatedAt;
    schema.createdBy = skill.createdBy ?? null;
    return schema;
  }
}