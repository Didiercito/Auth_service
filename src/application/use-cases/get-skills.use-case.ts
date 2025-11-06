import { GetSkillsDto } from '../dtos/get-skills.dto';
import { ISkillRepository } from '../../domain/interfaces/skill.repository.interface';
import { Skill } from '../../domain/entities/skill.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetSkillsUseCase {
  constructor(private readonly skillRepository: ISkillRepository) {}

  async execute(dto: GetSkillsDto): Promise<PaginatedResult<Skill>> {
    const { page = 1, limit = 50, search, isActive = true } = dto;

    const result = await this.skillRepository.findPaginated({
      page,
      limit,
      search,
      isActive
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      data: result.data,
      total: result.total,
      page,
      limit,
      totalPages
    };
  }
}