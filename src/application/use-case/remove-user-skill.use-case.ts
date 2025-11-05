import { RemoveSkillDto } from '../dtos/remove-skill.dto';
import { IUserSkillRepository } from '../../domain/interfaces/user-skill.repository.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface.ts';

export class RemoveUserSkillUseCase {
  constructor(
    private readonly userSkillRepository: IUserSkillRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: RemoveSkillDto): Promise<void> {
    // Validar que el usuario existe
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validar que el usuario tiene esta skill
    const userSkill = await this.userSkillRepository.findByUserIdAndSkillId(
      dto.userId,
      dto.skillId
    );

    if (!userSkill) {
      throw new Error('User does not have this skill');
    }

    // Eliminar la relación
    await this.userSkillRepository.delete(userSkill.id);
  }
}