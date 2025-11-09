import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IUserReputationHistoryRepository } from '../../domain/interfaces/user-reputation-history.repository.interface';
import { UserReputationHistory } from '../../domain/entities/user-reputation-history.entity';

export class UpdateUserReputationUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly reputationHistoryRepository: IUserReputationHistoryRepository
  ) {}

  async execute(dto: any): Promise<UserReputationHistory> {
    if (!dto.userId || dto.changeAmount === undefined || !dto.reason) {
      throw new Error('User ID, changeAmount, and reason are required');
    }
    
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const previousScore = user.reputationScore;
    const changeAmount = parseInt(dto.changeAmount);
    
    if (isNaN(changeAmount) || changeAmount < -100 || changeAmount > 100) {
        throw new Error('changeAmount must be a number between -100 and 100');
    }

    let newScore = previousScore + changeAmount;
    if (newScore < 0) newScore = 0;
    if (newScore > 100) newScore = 100;

    user.reputationScore = newScore;
    user.updatedAt = new Date();
    await this.userRepository.update(user);

    const historyEntry = new UserReputationHistory(
      0,
      dto.userId,
      changeAmount,
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