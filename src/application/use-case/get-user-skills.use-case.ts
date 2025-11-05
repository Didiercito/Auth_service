import { GetUserSkillsDto } from '../dtos/get-user-skills.dto';
import { IUserSkillRepository } from '../../domain/interfaces/user-skill.repository.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface.ts';
import { UserSkill } from '../../domain/entities/user-skill.entity';

export class GetUserSkillsUseCase {
  constructor(
    private readonly userSkillRepository: IUserSkillRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: GetUserSkillsDto): Promise<UserSkill[]> {
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw new Error('User not found');
    }

    return await this.userSkillRepository.findByUserId(dto.userId);
  }
}