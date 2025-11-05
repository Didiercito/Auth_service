import { DeleteUserDto } from '../dtos/delete-user.dto';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface.ts';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: DeleteUserDto): Promise<void> {
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.delete(dto.userId);
  }
}