import { IUserScheduleRepository } from '../../domain/interfaces/user-schedule.repository.interface';

export class DeleteUserScheduleUseCase {
  constructor(
    private readonly userScheduleRepository: IUserScheduleRepository
  ) {}

  async execute(dto: any): Promise<void> {
    if (!dto.scheduleId) {
      throw new Error('Schedule ID is required');
    }
    
    const schedule = await this.userScheduleRepository.findById(dto.scheduleId);
    if (!schedule) {
      throw new Error('Schedule not found');
    }

    await this.userScheduleRepository.delete(dto.scheduleId);
  }
}