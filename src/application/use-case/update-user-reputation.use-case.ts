import { UpdateReputationDto } from '../dtos/update-reputation.dto';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface.ts';
import { IUserReputationHistoryRepository } from '../../domain/interfaces/user-reputation-history.repository.interface';
import { UserReputationHistory } from '../../domain/entities/user-reputation-history.entity';

export class UpdateUserReputationUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly reputationHistoryRepository: IUserReputationHistoryRepository
  ) {}

  async execute(dto: UpdateReputationDto): Promise<UserReputationHistory> {
    // Validar que el usuario existe
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Guardar el score anterior
    const previousScore = user.reputationScore;

    // Calcular el nuevo score
    let newScore = previousScore + dto.changeAmount;

    // Asegurar que el score esté entre 0 y 100
    if (newScore < 0) newScore = 0;
    if (newScore > 100) newScore = 100;

    // Actualizar el score del usuario
    user.reputationScore = newScore;
    user.updatedAt = new Date();
    await this.userRepository.update(user);

    // Crear registro en el historial
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