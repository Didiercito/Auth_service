import { IUserScheduleRepository } from '../../domain/interfaces/user-schedule.repository.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { UserSchedule } from '../../domain/entities/user-schedule.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetUserSchedulesUseCase {
  constructor(
    private readonly userScheduleRepository: IUserScheduleRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: any): Promise<PaginatedResult<UserSchedule>> {
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
    const eventId = parseInt(dto.eventId) || undefined;
    
    const result = await this.userScheduleRepository.findByUserIdPaginated({
      userId: dto.userId,
      page,
      limit,
      startDate,
      endDate,
      eventId
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