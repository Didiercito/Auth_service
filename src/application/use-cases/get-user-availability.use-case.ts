import { GetUserAvailabilityDto } from '../dtos/get-user-availability.dto';
import { IUserAvailabilityRepository } from '../../domain/interfaces/user-availability.repository.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { UserAvailability } from '../../domain/entities/user-availability.entity';

export class GetUserAvailabilityUseCase {
  constructor(
    private readonly userAvailabilityRepository: IUserAvailabilityRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: GetUserAvailabilityDto): Promise<UserAvailability[]> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (dto.dayOfWeek) {
      return await this.userAvailabilityRepository.findByUserIdAndDay(
        dto.userId,
        dto.dayOfWeek
      );
    }

    return await this.userAvailabilityRepository.findByUserId(dto.userId);
  }
}