// src/application/use-cases/delete-my-account.use-case.ts

import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { rabbitmqConfig } from '../../config/rabbitmq.config';
import { IRoleRepository } from '../../domain/interfaces/role.repository.interface';
import { IEmailVerificationRepository } from '../../domain/interfaces/email-verification.repository.interface';

export class DeleteMyAccountUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly eventPublisher: IEventPublisher,
    private readonly roleRepository: IRoleRepository,
    private readonly emailVerificationRepository: IEmailVerificationRepository
  ) {}

  async execute(userId: number): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw { http_status: 404, message: 'User not found' };
    }

    await this.eventPublisher.publish(rabbitmqConfig.routingKeys.userDeleted, {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString()
    });

    await this.roleRepository.removeAllRolesFromUser(userId);
    
    await this.emailVerificationRepository.deleteByUserId(userId);

    await this.userRepository.delete(userId);

    return {
      message: 'Account and all related data deleted successfully.'
    };
  }
}