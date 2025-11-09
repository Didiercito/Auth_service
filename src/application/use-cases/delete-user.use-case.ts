import { IUserRepository } from '../../domain/interfaces/user.repository.interface';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: any): Promise<void> {
    if (!dto.userId) {
      throw new Error('User ID is required');
    }

    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.delete(dto.userId);
  }
}