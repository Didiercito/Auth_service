import { CreateScheduleDto } from '../dtos/create-schedule.dto';
import { IUserScheduleRepository } from '../../domain/interfaces/user-schedule.repository.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface.ts';
import { UserSchedule } from '../../domain/entities/user-schedule.entity';

export class CreateUserScheduleUseCase {
  constructor(
    private readonly userScheduleRepository: IUserScheduleRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: CreateScheduleDto): Promise<UserSchedule> {
    // Validar que el usuario existe
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validar que startDateTime sea antes que endDateTime
    if (dto.startDateTime >= dto.endDateTime) {
      throw new Error('Invalid time range: start time must be before end time');
    }

    // Validar que no haya conflictos con schedules existentes
    const conflictingSchedules = await this.userScheduleRepository.findConflicts(
      dto.userId,
      dto.startDateTime,
      dto.endDateTime
    );

    if (conflictingSchedules.length > 0) {
      throw new Error('Schedule conflicts with existing schedules');
    }

    // Crear el schedule
    const schedule = new UserSchedule(
      0,
      dto.userId,
      dto.startDateTime,
      dto.endDateTime,
      dto.notes || null,
      dto.eventId || null,
      new Date(),
      new Date(),
      dto.createdBy || null
    );

    return await this.userScheduleRepository.create(schedule);
  }
}