import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
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

  async execute(dto: any): Promise<PaginatedResult<UserReputationHistory>> {
    if (!dto.userId) {
      throw new Error('User ID is required');
    }
    
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const page = parseInt(dto.page) || 1;
    const limit = parseInt(dto.limit) || 20;
    const startDate = dto.startDate ? new Date(dto.startDate) : undefined;
    const endDate = dto.endDate ? new Date(dto.endDate) : undefined;
    
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