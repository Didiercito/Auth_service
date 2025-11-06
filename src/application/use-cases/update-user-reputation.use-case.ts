import { UpdateReputationDto } from '../dtos/update-reputation.dto';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IUserReputationHistoryRepository } from '../../domain/interfaces/user-reputation-history.repository.interface';
import { UserReputationHistory } from '../../domain/entities/user-reputation-history.entity';

export class UpdateUserReputationUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly reputationHistoryRepository: IUserReputationHistoryRepository
  ) {}

  async execute(dto: UpdateReputationDto): Promise<UserReputationHistory> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const previousScore = user.reputationScore;

    let newScore = previousScore + dto.changeAmount;

    if (newScore < 0) newScore = 0;
    if (newScore > 100) newScore = 100;

    user.reputationScore = newScore;
    user.updatedAt = new Date();
    await this.userRepository.update(user);

    const historyEntry = new UserReputationHistory(
      0,
      dto.userId,
      dto.changeAmount,
      previousScore,
      newScore,
      dto.reason,
      dto.details || null,
      dto.relatedEventId || null,
      new Date(),
      dto.createdBy || null
    );

    return await this.reputationHistoryRepository.create(historyEntry);
  }
}