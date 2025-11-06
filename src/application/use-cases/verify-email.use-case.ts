import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IEmailVerificationRepository } from '../../domain/interfaces/email-verification.repository.interface';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { VerifyEmailDto } from '../dtos/verify-email.dto';
import { EmailVerificationValidator } from '../../domain/validators/email-verification.validator';
import { UserStatus } from '../../domain/entities/user.entity';

export class VerifyEmailUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailVerificationRepository: IEmailVerificationRepository,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(dto: VerifyEmailDto): Promise<{ message: string }> {
    const verification = await this.emailVerificationRepository.findByToken(dto.token);

    if (!verification) {
      throw {
        http_status: 404,
        message: 'Invalid verification token'
      };
    }

    const validator = new EmailVerificationValidator(verification);
    await validator.validateWithCustomRules();

    const user = await this.userRepository.findById(verification.userId);

    if (!user) {
      throw {
        http_status: 404,
        message: 'User not found'
      };
    }

    if (user.verifiedEmail) {
      throw {
        http_status: 400,
        message: 'Email already verified'
      };
    }

    user.verifiedEmail = true;
    user.emailVerifiedAt = new Date(); 
    user.updatedAt = new Date();

    if (user.verifiedPhone) {
      user.status = UserStatus.ACTIVE;
    }

    await this.userRepository.update(user); 

    verification.isUsed = true;
    verification.usedAt = new Date();
    await this.emailVerificationRepository.update(verification.id, verification);

    await this.eventPublisher.publish('user.email.verified', {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString()
    });

    return {
      message: 'Email verified successfully'
    };
  }
}