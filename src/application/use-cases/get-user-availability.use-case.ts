import { IUserAvailabilityRepository } from '../../domain/interfaces/user-availability.repository.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { UserAvailability, DayOfWeek } from '../../domain/entities/user-availability.entity';

export class GetUserAvailabilityUseCase {
  constructor(
    private readonly userAvailabilityRepository: IUserAvailabilityRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: any): Promise<UserAvailability[]> {
    if (!dto.userId) {
      throw new Error('User ID is required');
    }
    
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (dto.dayOfWeek) {
      const validDays = Object.values(DayOfWeek);
      if (!validDays.includes(dto.dayOfWeek)) {
        throw new Error('Invalid dayOfWeek specified');
      }
      return await this.userAvailabilityRepository.findByUserIdAndDay(
        dto.userId,
        dto.dayOfWeek
      );
    }

    return await this.userAvailabilityRepository.findByUserId(dto.userId);
  }
}