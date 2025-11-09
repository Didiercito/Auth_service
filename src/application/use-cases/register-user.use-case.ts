import { RegisterUserDto } from '../dtos/register-user.dto';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IPasswordHasher } from '../../domain/interfaces/password-hasher.interface';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { IRoleRepository } from '../../domain/interfaces/role.repository.interface';
import { ITokenGenerator } from '../../domain/interfaces/token-generator.interface';
import { User, UserStatus } from '../../domain/entities/user.entity';
import { UserValidator } from '../../domain/validators/user.validator';
import { PasswordStrengthValidator } from '../../domain/validators/password-strength.validator';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenGenerator: ITokenGenerator,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(dto: RegisterUserDto): Promise<{
    message: string;
    user: User;
    accessToken: string;
    refreshToken: string;
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
    
    const roles = await this.roleRepository.getUserRoles(savedUser.id);
    const roleNames = roles.map(role => role.name);
    
    const accessToken = this.tokenGenerator.generateAccessToken(
      savedUser.id,
      savedUser.email,
      roleNames
    );
    const refreshToken = this.tokenGenerator.generateRefreshToken(savedUser.id);

    await this.eventPublisher.publish('user.registered', {
      userId: savedUser.id,
      email: savedUser.email,
      names: savedUser.names,
      timestamp: new Date().toISOString()
    });
    return {
      message: 'User registered successfully. You can now login.',
      user: savedUser,
      accessToken,
      refreshToken,
    };
  }
}