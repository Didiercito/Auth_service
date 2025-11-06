import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IPhoneVerificationRepository } from '../../domain/interfaces/phone-verification.repository.interface';
import { ITokenGenerator } from '../../domain/interfaces/token-generator.interface';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { ResendPhoneVerificationDto } from '../dtos/resend-phone-verification.dto';
import { PhoneVerification } from '../../domain/entities/phone-verification.entity';

export class ResendPhoneVerificationUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly phoneVerificationRepository: IPhoneVerificationRepository,
    private readonly tokenGenerator: ITokenGenerator,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(dto: ResendPhoneVerificationDto): Promise<{ message: string; code?: string }> {
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw {
        http_status: 404,
        message: 'User not found'
      };
    }

    if (user.verifiedPhone) {
      throw {
        http_status: 400,
        message: 'Phone number is already verified'
      };
    }

    if (!user.phoneNumber) {
      throw {
        http_status: 400,
        message: 'User does not have a phone number'
      };
    }

    const lastVerification = await this.phoneVerificationRepository.findLatestByUserId(user.id);

    if (lastVerification) {
      const timeSinceLastSent = Date.now() - lastVerification.createdAt.getTime();
      const twoMinutes = 2 * 60 * 1000;

      if (timeSinceLastSent < twoMinutes) {
        throw {
          http_status: 429,
          message: 'Please wait before requesting a new verification code'
        };
      }
    }

    const verificationCode = this.tokenGenerator.generateNumericCode(6);
    const phoneVerification = new PhoneVerification(
      0,
      user.id,
      verificationCode,
      new Date(Date.now() + 10 * 60 * 1000), 
      false,
      0,
      new Date(),
      null
    );

    await this.phoneVerificationRepository.save(phoneVerification);

    await this.eventPublisher.publish('user.phone.verification.resent', {
      userId: user.id,
      phoneNumber: user.phoneNumber,
      verificationCode,
      timestamp: new Date().toISOString()
    });

    const isDevelopment = process.env.NODE_ENV === 'development';

    return {
      message: 'Verification code sent to your phone',
      ...(isDevelopment && { code: verificationCode })
    };
  }
}