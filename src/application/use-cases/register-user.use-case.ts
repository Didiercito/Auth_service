import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IPasswordHasher } from '../../domain/interfaces/password-hasher.interface';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { User, UserStatus } from '../../domain/entities/user.entity';
import { UserValidator } from '../../domain/validators/user.validator';
import { PasswordStrengthValidator } from '../../domain/validators/password-strength.validator';
import { IRoleRepository } from '../../domain/interfaces/role.repository.interface';
import { IUserSkillRepository } from '../../domain/interfaces/user-skill.repository.interface';
import { ISkillRepository } from '../../domain/interfaces/skill.repository.interface';
import { IUserAvailabilityRepository } from '../../domain/interfaces/user-availability.repository.interface';
import { UserSkill } from '../../domain/entities/user-skill.entity';
import { UserAvailability } from '../../domain/entities/user-availability.entity';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly eventPublisher: IEventPublisher,
    private readonly roleRepository: IRoleRepository,
    private readonly userSkillRepository: IUserSkillRepository,
    private readonly skillRepository: ISkillRepository,
    private readonly userAvailabilityRepository: IUserAvailabilityRepository
  ) {}

  async execute(dto: any): Promise<{
    message: string;
    user: User;
  }> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw {
        http_status: 409,
        message: 'Email already registered'
      };
    }

    const passwordValidator = new PasswordStrengthValidator(dto.password);
    await passwordValidator.validate();

    const hashedPassword = await this.passwordHasher.hash(dto.password);
    const newUser = new User(
      0,
      dto.names,
      dto.firstLastName,
      dto.secondLastName,
      dto.email,
      hashedPassword,
      null,
      dto.phoneNumber || null,
      0,
      null,
      UserStatus.ACTIVE,
      false, 
      false,
      null,
      null,
      dto.stateId,
      dto.municipalityId,
      new Date(),
      new Date(),
      null
    );
    const userValidator = new UserValidator(newUser);
    await userValidator.validateWithCustomRules();

    const savedUser = await this.userRepository.save(newUser);

    const volunteerRole = await this.roleRepository.findByName('Voluntario');
    if (!volunteerRole) {
       throw {
        http_status: 500,
        message: 'Volunteer role not found in system. Please contact administrator.'
      };
    }
    await this.roleRepository.assignRoleToUser(savedUser.id, volunteerRole.id!);

    if (dto.skillIds && dto.skillIds.length > 0) {
      for (const skillId of dto.skillIds) {
        const skill = await this.skillRepository.findById(skillId);
        if (!skill || !skill.isActive) {
          throw { http_status: 400, message: `Skill with ID ${skillId} not found or is inactive` };
        }

        const userSkill = new UserSkill(
          0, savedUser.id, skillId, null, null, new Date(), new Date()
        );
        await this.userSkillRepository.create(userSkill);
      }
    }

    if (dto.availabilitySlots && dto.availabilitySlots.length > 0) {
      for (const slot of dto.availabilitySlots) {
        const availability = new UserAvailability(
          0, savedUser.id, slot.dayOfWeek, slot.startTime, slot.endTime, new Date(), new Date()
        );
        await this.userAvailabilityRepository.create(availability);
      }
    }

    await this.eventPublisher.publish('user.registered', {
      userId: savedUser.id,
      email: savedUser.email,
      names: savedUser.names,
      timestamp: new Date().toISOString()
    });
    return {
      message: 'User registered successfully. You can now login.',
      user: savedUser
    };
  }
}