import { IUserScheduleRepository } from '../../domain/interfaces/user-schedule.repository.interface';
import { UserSchedule } from '../../domain/entities/user-schedule.entity';

export class UpdateUserScheduleUseCase {
  constructor(
    private readonly userScheduleRepository: IUserScheduleRepository
  ) {}

  async execute(dto: any): Promise<UserSchedule> {
    if (!dto.scheduleId) {
      throw new Error('Schedule ID is required');
    }
    
    const schedule = await this.userScheduleRepository.findById(dto.scheduleId);
    if (!schedule) {
      throw new Error('Schedule not found');
    }

    const updatedStartDateTime = dto.startDateTime ? new Date(dto.startDateTime) : schedule.startDateTime;
    const updatedEndDateTime = dto.endDateTime ? new Date(dto.endDateTime) : schedule.endDateTime;
    
    if (updatedStartDateTime >= updatedEndDateTime) {
      throw new Error('Invalid time range: start time must be before end time');
    }

    const excludeId = parseInt(dto.scheduleId);
    
    const conflictingSchedules = await this.userScheduleRepository.findConflictsExcluding(
      schedule.userId,
      updatedStartDateTime,
      updatedEndDateTime,
      excludeId
    );
    if (conflictingSchedules.length > 0) {
      throw new Error('Schedule conflicts with existing schedules');
    }

    if (dto.startDateTime !== undefined) schedule.startDateTime = updatedStartDateTime;
    if (dto.endDateTime !== undefined) schedule.endDateTime = updatedEndDateTime;
    if (dto.notes !== undefined) schedule.notes = dto.notes;
    if (dto.eventId !== undefined) schedule.eventId = dto.eventId;

    schedule.updatedAt = new Date();
    return await this.userScheduleRepository.update(schedule);
  }
}