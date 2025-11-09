import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetUsersPaginatedUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: any): Promise<PaginatedResult<User>> {
    const page = parseInt(dto.page) || 1;
    const limit = parseInt(dto.limit) || 10;
    const search = dto.search;
    const status = dto.status;
    const stateId = parseInt(dto.stateId) || undefined;
    const municipalityId = parseInt(dto.municipalityId) || undefined;
    
    const result = await this.userRepository.findPaginated({
      page,
      limit,
      search,
      status,
      stateId,
      municipalityId
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