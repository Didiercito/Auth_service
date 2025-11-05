import { AddSkillDto } from '../dtos/add-skill.dto';
import { IUserSkillRepository } from '../../domain/interfaces/user-skill.repository.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface.ts';
import { ISkillRepository } from '../../domain/interfaces/skill.repository.interface';
import { UserSkill } from '../../domain/entities/user-skill.entity';

export class AddUserSkillUseCase {
  constructor(
    private readonly userSkillRepository: IUserSkillRepository,
    private readonly userRepository: IUserRepository,
    private readonly skillRepository: ISkillRepository
  ) {}

  async execute(dto: AddSkillDto): Promise<UserSkill> {
    // Validar que el usuario existe
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validar que la skill existe
    const skill = await this.skillRepository.findById(dto.skillId);
    if (!skill) {
      throw new Error('Skill not found');
    }

    // Validar que la skill está activa
    if (!skill.isActive) {
      throw new Error('Skill is not active');
    }

    // Validar que el usuario no tenga ya esta skill
    const existingUserSkill = await this.userSkillRepository.findByUserIdAndSkillId(
      dto.userId,
      dto.skillId
    );

    if (existingUserSkill) {
      throw new Error('User already has this skill');
    }

    // Crear la relación usuario-skill
    const userSkill = new UserSkill(
      0,
      dto.userId,
      dto.skillId,
      dto.proficiencyLevel || null,
      dto.yearsOfExperience || null,
      new Date(),
      new Date()
    );

    return await this.userSkillRepository.create(userSkill);
  }
}