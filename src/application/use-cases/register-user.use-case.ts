import { User, UserStatus } from '../../domain/entities/user.entity';
import { EmailVerification } from '../../domain/entities/email-verification.entity';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IEmailVerificationRepository } from '../../domain/interfaces/email-verification.repository.interface';
import { IPasswordHasher } from '../../domain/interfaces/password-hasher.interface';
import { ITokenGenerator } from '../../domain/interfaces/token-generator.interface';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { UserValidator } from '../../domain/validators/user.validator';
import { PasswordStrengthValidator } from '../../domain/validators/password-strength.validator';

export interface RegisterUserResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailVerificationRepository: IEmailVerificationRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenGenerator: ITokenGenerator,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(dto: RegisterUserDto): Promise<RegisterUserResponse> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw {
        http_status: 409,
        message: 'Email already registered'
      };
    }

    const passwordValidator = new PasswordStrengthValidator(dto.password);
    const passwordValidation = passwordValidator.validateMinimumRequirements();

    if (!passwordValidation.isValid) {
      throw {
        http_status: 422,
        validations: [{
          property: 'password',
          errorMessages: passwordValidation.errors
        }]
      };
    }

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const user = new User(
      0,
      dto.names,
      dto.firstLastName,
      dto.secondLastName,
      dto.email.toLowerCase(),
      hashedPassword,
      '',
      dto.phoneNumber || null,
      0, 
      null, 
      UserStatus.PENDING,
      false, 
      false, 
      null, 
      null, 
      null, 
      null, 
      new Date(),
      new Date(), 
      null 
    );

    const userValidator = new UserValidator(user);
    await userValidator.validateOrThrow();

    const savedUser = await this.userRepository.save(user);

    const verificationToken = this.tokenGenerator.generateRandomToken();
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const emailVerification = new EmailVerification(
      0,
      savedUser.id,
      verificationToken,
      expiresAt,
      false, 
      new Date(), 
      null 
    );
    
    await this.emailVerificationRepository.save(emailVerification);

    const accessToken = this.tokenGenerator.generateAccessToken(
      savedUser.id,
      savedUser.email
    );
    const refreshToken = this.tokenGenerator.generateRefreshToken(savedUser.id);

    await this.eventPublisher.publish('user.registered', {
      userId: savedUser.id,
      email: savedUser.email,
      names: savedUser.names,
      verificationToken,
      timestamp: new Date().toISOString()
    });

    return {
      user: savedUser,
      accessToken,
      refreshToken,
      message: 'User registered successfully. Please verify your email.'
    };
  }
}