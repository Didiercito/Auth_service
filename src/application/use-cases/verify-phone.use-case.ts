import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IPhoneVerificationRepository } from '../../domain/interfaces/phone-verification.repository.interface';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { PhoneVerificationValidator } from '../../domain/validators/phone-verification.validator';

export class VerifyPhoneUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly phoneVerificationRepository: IPhoneVerificationRepository,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(dto: any): Promise<{ message: string }> {
    if (!dto.userId || !dto.code) {
      throw { http_status: 400, message: 'User ID and code are required' };
    }
    
    const verification = await this.phoneVerificationRepository.findLatestByUserId(dto.userId);
    if (!verification) {
      throw {
        http_status: 404,
        message: 'No verification code found. Please request a new one.'
      };
    }

    const validator = new PhoneVerificationValidator(verification);
    await validator.validateWithCustomRules();

    verification.attempts += 1;
    await this.phoneVerificationRepository.update(verification.id, verification);

    if (verification.code !== dto.code) {
      const remainingAttempts = validator.getRemainingAttempts();
      throw {
        http_status: 400,
        message: `Invalid verification code. ${remainingAttempts} attempts remaining.`
      };
    }

    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw {
        http_status: 404,
        message: 'User not found'
      };
    }

    user.verifiedPhone = true;
    user.phoneVerifiedAt = new Date(); 
    user.updatedAt = new Date();

    await this.userRepository.update(user);

    verification.isUsed = true;
    verification.usedAt = new Date();
    await this.phoneVerificationRepository.update(verification.id, verification);

    await this.eventPublisher.publish('user.phone.verified', {
      userId: user.id,
      phoneNumber: user.phoneNumber,
      timestamp: new Date().toISOString()
    });
    return {
      message: 'Phone number verified successfully'
    };
  }
}