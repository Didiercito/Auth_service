import { GetReputationHistoryDto } from '../dtos/get-reputation-history.dto';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface.ts';
import { IUserReputationHistoryRepository } from '../../domain/interfaces/user-reputation-history.repository.interface';
import { UserReputationHistory } from '../../domain/entities/user-reputation-history.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetUserReputationHistoryUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly reputationHistoryRepository: IUserReputationHistoryRepository
  ) {}

  async execute(dto: GetReputationHistoryDto): Promise<PaginatedResult<UserReputationHistory>> {
    // Validar que el usuario existe
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { page = 1, limit = 20, startDate, endDate } = dto;

    const result = await this.reputationHistoryRepository.findByUserIdPaginated({
      userId: dto.userId,
      page,
      limit,
      startDate,
      endDate
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