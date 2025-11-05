import { SetAvailabilityDto } from '../dtos/set-availability.dto';
import { IUserAvailabilityRepository } from '../../domain/interfaces/user-availability.repository.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface.ts';
import { UserAvailability } from '../../domain/entities/user-availability.entity';

export class SetUserAvailabilityUseCase {
  constructor(
    private readonly userAvailabilityRepository: IUserAvailabilityRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: SetAvailabilityDto): Promise<UserAvailability[]> {
    // Validar que el usuario existe
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validar que los horarios no se traslapen
    for (let i = 0; i < dto.availabilitySlots.length; i++) {
      const slot = dto.availabilitySlots[i];
      
      if (slot.startTime >= slot.endTime) {
        throw new Error(`Invalid time range for ${slot.dayOfWeek}: start time must be before end time`);
      }

      // Validar que no haya traslapes en el mismo día
      for (let j = i + 1; j < dto.availabilitySlots.length; j++) {
        const otherSlot = dto.availabilitySlots[j];
        
        if (slot.dayOfWeek === otherSlot.dayOfWeek) {
          const slot1Start = this.timeToMinutes(slot.startTime);
          const slot1End = this.timeToMinutes(slot.endTime);
          const slot2Start = this.timeToMinutes(otherSlot.startTime);
          const slot2End = this.timeToMinutes(otherSlot.endTime);

          if (this.hasOverlap(slot1Start, slot1End, slot2Start, slot2End)) {
            throw new Error(`Time slots overlap on ${slot.dayOfWeek}`);
          }
        }
      }
    }

    // Eliminar disponibilidad anterior del usuario
    await this.userAvailabilityRepository.deleteByUserId(dto.userId);

    // Crear nuevas disponibilidades
    const availabilities: UserAvailability[] = [];

    for (const slot of dto.availabilitySlots) {
      const availability = new UserAvailability(
        0,
        dto.userId,
        slot.dayOfWeek,
        slot.startTime,
        slot.endTime,
        new Date(),
        new Date()
      );

      const created = await this.userAvailabilityRepository.create(availability);
      availabilities.push(created);
    }

    return availabilities;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private hasOverlap(
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): boolean {
    return start1 < end2 && start2 < end1;
  }
}