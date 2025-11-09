import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IRoleRepository } from '../../domain/interfaces/role.repository.interface';
import { IPasswordHasher } from '../../domain/interfaces/password-hasher.interface';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { User, UserStatus } from '../../domain/entities/user.entity';
import { UserValidator } from '../../domain/validators/user.validator';
import { PasswordStrengthValidator } from '../../domain/validators/password-strength.validator';

export class RegisterKitchenAdminUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(dto: any): Promise<{
    success: boolean;
    message: string;
    userId: number;
    email: string;
  }> {
    const { responsibleData, kitchenData, locationData } = dto;

    if (!responsibleData || !kitchenData || !locationData) {
      throw { http_status: 400, message: 'Missing required data sections (responsibleData, kitchenData, locationData)' };
    }
    if (!responsibleData.email || !responsibleData.password || !responsibleData.names) {
      throw { http_status: 400, message: 'Missing essential responsible data (email, password, names)' };
    }
    
    const existingUser = await this.userRepository.findByEmail(responsibleData.email);
    if (existingUser) {
      throw {
        http_status: 409,
        message: 'Email already registered'
      };
    }

    const passwordValidator = new PasswordStrengthValidator(responsibleData.password);
    await passwordValidator.validate();

    const hashedPassword = await this.passwordHasher.hash(responsibleData.password);
    const newUser = new User(
      0,
      responsibleData.names,
      responsibleData.firstLastName,
      responsibleData.secondLastName,
      responsibleData.email,
      hashedPassword,
      null,
      responsibleData.phoneNumber || null,
      0,
      null,
      UserStatus.PENDING,
      false,
      false,
      null,
      null,
      responsibleData.stateId,
      responsibleData.municipalityId,
      new Date(),
      new Date(),
      null
    );
    const userValidator = new UserValidator(newUser);
    await userValidator.validateWithCustomRules();

    const savedUser = await this.userRepository.save(newUser);

    const adminCocinaRole = await this.roleRepository.findByName('Admin_cocina');
    if (!adminCocinaRole) {
      throw {
        http_status: 500,
        message: 'Admin_cocina role not found in database'
      };
    }

    await this.roleRepository.assignRoleToUser(savedUser.id, adminCocinaRole.id!, savedUser.id);

    await this.eventPublisher.publish('user.registered', {
      userId: savedUser.id,
      email: savedUser.email,
      names: savedUser.names,
      firstLastName: savedUser.firstLastName,
      secondLastName: savedUser.secondLastName,
      timestamp: new Date().toISOString()
    });
    await this.eventPublisher.publish('kitchen.admin.registered', {
      userId: savedUser.id,
      userData: {
        email: savedUser.email,
        names: savedUser.names,
        firstLastName: savedUser.firstLastName,
        secondLastName: savedUser.secondLastName,
        phoneNumber: savedUser.phoneNumber
      },
      kitchenData: {
        name: kitchenData.name,
        description: kitchenData.description,
        contactPhone: kitchenData.contactPhone,
        contactEmail: kitchenData.contactEmail,
        imageUrl: kitchenData.imageUrl || null
      },
      locationData: {
        streetAddress: locationData.streetAddress,
        neighborhood: locationData.neighborhood,
        stateId: locationData.stateId,
        municipalityId: locationData.municipalityId,
        postalCode: locationData.postalCode,
        capacity: locationData.capacity || null
      },
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Kitchen admin registered successfully. Please verify your email to activate the kitchen.',
      userId: savedUser.id,
      email: savedUser.email
    };
  }
}