import { DeleteScheduleDto } from '../dtos/delete-schedule.dto';
import { IUserScheduleRepository } from '../../domain/interfaces/user-schedule.repository.interface';

export class DeleteUserScheduleUseCase {
  constructor(
    private readonly userScheduleRepository: IUserScheduleRepository
  ) {}

  async execute(dto: DeleteScheduleDto): Promise<void> {
    const schedule = await this.userScheduleRepository.findById(dto.scheduleId);
    if (!schedule) {
      throw new Error('Schedule not found');
    }

    await this.userScheduleRepository.delete(dto.scheduleId);
  }
}