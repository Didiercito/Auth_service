import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

export class UpdateProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (dto.names !== undefined) user.names = dto.names;
    if (dto.firstLastName !== undefined) user.firstLastName = dto.firstLastName;
    if (dto.secondLastName !== undefined) user.secondLastName = dto.secondLastName;
    if (dto.phoneNumber !== undefined) user.phoneNumber = dto.phoneNumber;
    if (dto.imageProfile !== undefined) user.imageProfile = dto.imageProfile;
    if (dto.stateId !== undefined) user.stateId = dto.stateId;
    if (dto.municipalityId !== undefined) user.municipalityId = dto.municipalityId;

    user.updatedAt = new Date();

    return await this.userRepository.update(user);
  }
}