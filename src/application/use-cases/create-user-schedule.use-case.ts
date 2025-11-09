import { IUserScheduleRepository } from '../../domain/interfaces/user-schedule.repository.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { UserSchedule } from '../../domain/entities/user-schedule.entity';

export class CreateUserScheduleUseCase {
  constructor(
    private readonly userScheduleRepository: IUserScheduleRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: any): Promise<UserSchedule> {
    if (!dto.userId || !dto.startDateTime || !dto.endDateTime) {
      throw new Error('User ID, startDateTime, and endDateTime are required');
    }
    
    const startDateTime = new Date(dto.startDateTime);
    const endDateTime = new Date(dto.endDateTime);
    
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (startDateTime >= endDateTime) {
      throw new Error('Invalid time range: start time must be before end time');
    }

    const conflictingSchedules = await this.userScheduleRepository.findConflicts(
      dto.userId,
      startDateTime,
      endDateTime
    );

    if (conflictingSchedules.length > 0) {
      throw new Error('Schedule conflicts with existing schedules');
    }

    const schedule = new UserSchedule(
      0,
      dto.userId,
      startDateTime,
      endDateTime,
      dto.notes || null,
      dto.eventId || null,
      new Date(),
      new Date(),
      dto.createdBy || null
    );

    return await this.userScheduleRepository.create(schedule);
  }
}