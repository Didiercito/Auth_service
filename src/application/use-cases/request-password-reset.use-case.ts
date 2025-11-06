import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IPasswordResetTokenRepository } from '../../domain/interfaces/password-reset-token.repository.interface';
import { ITokenGenerator } from '../../domain/interfaces/token-generator.interface';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { RequestPasswordResetDto } from '../dtos/request-password-reset.dto';
import { PasswordResetToken } from '../../domain/entities/password-reset-token.entity';

export class RequestPasswordResetUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordResetTokenRepository: IPasswordResetTokenRepository,
    private readonly tokenGenerator: ITokenGenerator,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(dto: RequestPasswordResetDto): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(dto.email.toLowerCase());

    if (!user) {
      return {
        message: 'If the email exists, a password reset link will be sent.'
      };
    }

    await this.passwordResetTokenRepository.invalidateAllByUserId(user.id);

    const resetToken = this.tokenGenerator.generateRandomToken();
    const passwordResetToken = new PasswordResetToken(
      0,
      user.id,
      resetToken,
      new Date(Date.now() + 60 * 60 * 1000), 
      false,
      new Date(),
      null
    );

    await this.passwordResetTokenRepository.save(passwordResetToken);

    await this.eventPublisher.publish('user.password.reset.requested', {
      userId: user.id,
      email: user.email,
      resetToken,
      timestamp: new Date().toISOString()
    });

    return {
      message: 'If the email exists, a password reset link will be sent.'
    };
  }
}