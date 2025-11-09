import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IUserSkillRepository } from '../../domain/interfaces/user-skill.repository.interface';
import { ISkillRepository } from '../../domain/interfaces/skill.repository.interface';
import { AssignVolunteerRoleUseCase } from './assign-volunteer-role.use-case';
import { UserSkill } from '../../domain/entities/user-skill.entity';

export class CompleteProfileUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userSkillRepository: IUserSkillRepository,
    private readonly skillRepository: ISkillRepository,
    private readonly assignVolunteerRoleUseCase: AssignVolunteerRoleUseCase
  ) {}

  async execute(dto: any): Promise<{
    message: string;
  }> {
    if (!dto.userId) {
       throw { http_status: 400, message: 'User ID is required' };
    }

    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw {
        http_status: 404,
        message: 'User not found'
      };
    }
    if (dto.skillIds && dto.skillIds.length > 0) {
      for (const skillId of dto.skillIds) {
        const skill = await this.skillRepository.findById(skillId);
        if (!skill) {
          throw {
            http_status: 404,
            message: `Skill with ID ${skillId} not found`
          };
        }

        const userSkill = new UserSkill(
          0,
          dto.userId,
          skillId,
          null,
          null,
          new Date(),
          new Date()
        );
        await this.userSkillRepository.create(userSkill);
      }
    }

    await this.assignVolunteerRoleUseCase.execute(dto.userId);
    return {
      message: 'Profile completed successfully. You can now login.'
    };
  }
}