import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IPasswordResetTokenRepository } from '../../domain/interfaces/password-reset-token.repository.interface';
import { IPasswordHasher } from '../../domain/interfaces/password-hasher.interface';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { PasswordResetTokenValidator } from '../../domain/validators/password-reset-token.validator';
import { PasswordStrengthValidator } from '../../domain/validators/password-strength.validator';

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordResetTokenRepository: IPasswordResetTokenRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(dto: ResetPasswordDto): Promise<{ message: string }> {
    const resetToken = await this.passwordResetTokenRepository.findByToken(dto.token);

    if (!resetToken) {
      throw {
        http_status: 404,
        message: 'Invalid or expired password reset token'
      };
    }

    const validator = new PasswordResetTokenValidator(resetToken);
    await validator.validateWithCustomRules();

    const passwordValidator = new PasswordStrengthValidator(dto.newPassword);
    const passwordValidation = passwordValidator.validateMinimumRequirements();

    if (!passwordValidation.isValid) {
      throw {
        http_status: 422,
        validations: [{
          property: 'newPassword',
          errorMessages: passwordValidation.errors
        }]
      };
    }

    const user = await this.userRepository.findById(resetToken.userId);

    if (!user) {
      throw {
        http_status: 404,
        message: 'User not found'
      };
    }

    const hashedPassword = await this.passwordHasher.hash(dto.newPassword);

    user.passwordHash = hashedPassword;
    user.updatedAt = new Date();
    await this.userRepository.update(user); 

    resetToken.isUsed = true;
    resetToken.usedAt = new Date();
    await this.passwordResetTokenRepository.update(resetToken.id, resetToken);

    await this.eventPublisher.publish('user.password.reset.completed', {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString()
    });

    return {
      message: 'Password reset successfully'
    };
  }
}