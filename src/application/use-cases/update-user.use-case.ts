import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: any): Promise<User> {
    if (!dto.userId) {
      throw new Error('User ID is required');
    }
    
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    if (dto.names !== undefined) user.names = dto.names;
    if (dto.firstLastName !== undefined) user.firstLastName = dto.firstLastName;
    if (dto.secondLastName !== undefined) user.secondLastName = dto.secondLastName;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.phoneNumber !== undefined) user.phoneNumber = dto.phoneNumber;
    if (dto.imageProfile !== undefined) user.imageProfile = dto.imageProfile;
    if (dto.status !== undefined) user.status = dto.status;
    if (dto.reputationScore !== undefined) user.reputationScore = dto.reputationScore;
    if (dto.stateId !== undefined) user.stateId = dto.stateId;
    if (dto.municipalityId !== undefined) user.municipalityId = dto.municipalityId;

    user.updatedAt = new Date();

    return await this.userRepository.update(user);
  }
}