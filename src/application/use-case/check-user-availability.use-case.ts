import { CheckAvailabilityDto } from '../dtos/check-availability.dto';
import { IUserAvailabilityRepository } from '../../domain/interfaces/user-availability.repository.interface';
import { IUserScheduleRepository } from '../../domain/interfaces/user-schedule.repository.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface.ts';
import { DayOfWeek } from '../../domain/entities/user-availability.entity';

export interface AvailabilityCheckResult {
  isAvailable: boolean;
  reason?: string;
  conflictingSchedules?: any[];
}

export class CheckUserAvailabilityUseCase {
  constructor(
    private readonly userAvailabilityRepository: IUserAvailabilityRepository,
    private readonly userScheduleRepository: IUserScheduleRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: CheckAvailabilityDto): Promise<AvailabilityCheckResult> {
    // Validar que el usuario existe
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validar que startDateTime sea antes que endDateTime
    if (dto.startDateTime >= dto.endDateTime) {
      return {
        isAvailable: false,
        reason: 'Invalid time range: start time must be before end time'
      };
    }

    // Obtener el día de la semana
    const dayOfWeek = this.getDayOfWeek(dto.startDateTime);

    // Verificar disponibilidad general del usuario para ese día
    const availabilities = await this.userAvailabilityRepository.findByUserIdAndDay(
      dto.userId,
      dayOfWeek
    );

    if (availabilities.length === 0) {
      return {
        isAvailable: false,
        reason: `User has no availability configured for ${dayOfWeek}`
      };
    }

    // Verificar si el horario solicitado está dentro de la disponibilidad
    const requestedStartTime = this.getTimeString(dto.startDateTime);
    const requestedEndTime = this.getTimeString(dto.endDateTime);

    const isWithinAvailability = availabilities.some(availability => {
      return this.isTimeInRange(
        requestedStartTime,
        requestedEndTime,
        availability.startTime,
        availability.endTime
      );
    });

    if (!isWithinAvailability) {
      return {
        isAvailable: false,
        reason: 'Requested time is outside user availability hours'
      };
    }

    // Verificar conflictos con schedules existentes
    const conflictingSchedules = await this.userScheduleRepository.findConflicts(
      dto.userId,
      dto.startDateTime,
      dto.endDateTime
    );

    if (conflictingSchedules.length > 0) {
      return {
        isAvailable: false,
        reason: 'User has conflicting schedules',
        conflictingSchedules
      };
    }

    return {
      isAvailable: true
    };
  }

  private getDayOfWeek(date: Date): DayOfWeek {
    const days = [
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY
    ];
    return days[date.getDay()];
  }

  private getTimeString(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private isTimeInRange(
    startTime: string,
    endTime: string,
    availabilityStart: string,
    availabilityEnd: string
  ): boolean {
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);
    const availStart = this.timeToMinutes(availabilityStart);
    const availEnd = this.timeToMinutes(availabilityEnd);

    return start >= availStart && end <= availEnd;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}