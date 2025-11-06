import { RemoveSkillDto } from '../dtos/remove-skill.dto';
import { IUserSkillRepository } from '../../domain/interfaces/user-skill.repository.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';

export class RemoveUserSkillUseCase {
  constructor(
    private readonly userSkillRepository: IUserSkillRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: RemoveSkillDto): Promise<void> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const userSkill = await this.userSkillRepository.findByUserIdAndSkillId(
      dto.userId,
      dto.skillId
    );

    if (!userSkill) {
      throw new Error('User does not have this skill');
    }

    await this.userSkillRepository.delete(userSkill.id);
  }
}