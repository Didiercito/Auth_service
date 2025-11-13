import { IUserAvailabilityRepository } from '../../domain/interfaces/user-availability.repository.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { DayOfWeek, UserAvailability } from '../../domain/entities/user-availability.entity';

export class SetUserAvailabilityUseCase {
  constructor(
    private readonly userAvailabilityRepository: IUserAvailabilityRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: any): Promise<{
    message: string;
    userId: number;
    updatedSlots: UserAvailability[];
  }> {
    if (!dto.userId || !Array.isArray(dto.availabilitySlots)) {
      throw new Error('User ID and valid availabilitySlots array are required');
    }

    const user = await this.userRepository.findById(dto.userId);
    if (!user) throw new Error('User not found');

    const currentAvailabilities = await this.userAvailabilityRepository.findByUserId(dto.userId);

    const incomingMap = new Map(
      dto.availabilitySlots.map((slot: any) => [slot.dayOfWeek, slot])
    );

    const updatedSlots: UserAvailability[] = [];

    currentAvailabilities.forEach(existing => {
        if (incomingMap.has(existing.dayOfWeek)) {
            incomingMap.delete(existing.dayOfWeek); 
        }
        updatedSlots.push(existing); 
    });

    for (const [dayOfWeek, slot] of incomingMap.entries()) {
      
      const typedSlot = slot as { startTime: string; endTime: string };
      
      const newAvailability = new UserAvailability(
        0,
        dto.userId,
        dayOfWeek as DayOfWeek, 
        typedSlot.startTime,
        typedSlot.endTime,
        new Date(),
        new Date()
      );

      const created = await this.userAvailabilityRepository.create(newAvailability);
      updatedSlots.push(created);
    }

    return {
      message: 'Disponibilidad actualizada correctamente',
      userId: dto.userId,
      updatedSlots
    };
  }
}