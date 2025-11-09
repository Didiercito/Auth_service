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

  async execute(dto: any): Promise<PaginatedResult<Skill>> {
    const page = parseInt(dto.page) || 1;
    const limit = parseInt(dto.limit) || 50;
    const search = dto.search;
    const isActive = dto.isActive !== undefined ? (dto.isActive === 'true' || dto.isActive === true) : true;
    
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