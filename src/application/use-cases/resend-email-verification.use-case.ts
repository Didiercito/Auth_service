import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IEmailVerificationRepository } from '../../domain/interfaces/email-verification.repository.interface';
import { ITokenGenerator } from '../../domain/interfaces/token-generator.interface';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { EmailVerification } from '../../domain/entities/email-verification.entity';

export class ResendEmailVerificationUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailVerificationRepository: IEmailVerificationRepository,
    private readonly tokenGenerator: ITokenGenerator,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(dto: any): Promise<{ message: string }> {
    if (!dto.email) {
       throw { http_status: 400, message: 'Email is required' };
    }

    const user = await this.userRepository.findByEmail(dto.email.toLowerCase());
    if (!user) {
      return {
        message: 'If the email exists, a verification link will be sent.'
      };
    }

    if (user.verifiedEmail) {
      throw {
        http_status: 400,
        message: 'Email is already verified'
      };
    }

    const lastVerification = await this.emailVerificationRepository.findLatestByUserId(user.id);

    if (lastVerification) {
      const timeSinceLastSent = Date.now() - lastVerification.createdAt.getTime();
      const oneMinute = 60 * 1000;

      if (timeSinceLastSent < oneMinute) {
        throw {
          http_status: 429,
          message: 'Please wait before requesting a new verification email'
        };
      }
    }

    const verificationToken = this.tokenGenerator.generateRandomToken();
    const emailVerification = new EmailVerification(
      0,
      user.id,
      verificationToken,
      new Date(Date.now() + 24 * 60 * 60 * 1000), 
      false,
      new Date(),
      null
    );
    await this.emailVerificationRepository.save(emailVerification);

    await this.eventPublisher.publish('user.email.verification.resent', {
      userId: user.id,
      email: user.email,
      verificationToken,
      timestamp: new Date().toISOString()
    });
    return {
      message: 'If the email exists, a verification link will be sent.'
    };
  }
}