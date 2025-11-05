import { GetUsersPaginatedDto } from '../dtos/get-users-paginated.dto';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface.ts';
import { User } from '../../domain/entities/user.entitie';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetUsersPaginatedUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: GetUsersPaginatedDto): Promise<PaginatedResult<User>> {
    const { page = 1, limit = 10, search, status, stateId, municipalityId } = dto;

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