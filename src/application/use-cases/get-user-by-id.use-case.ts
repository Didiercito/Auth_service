import { GetUserDto } from '../dtos/get-user.dto';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: GetUserDto): Promise<User> {
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}