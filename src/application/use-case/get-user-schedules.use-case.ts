import { GetUserSchedulesDto } from '../dtos/get-user-schedules.dto';
import { IUserScheduleRepository } from '../../domain/interfaces/user-schedule.repository.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface.ts';
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

  async execute(dto: GetUserSchedulesDto): Promise<PaginatedResult<UserSchedule>> {
    // Validar que el usuario existe
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { page = 1, limit = 20, startDate, endDate, eventId } = dto;

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