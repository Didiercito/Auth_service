import { Request, Response } from 'express';
import { IUserAvailabilityRepository } from '../../../domain/interfaces/user-availability.repository.interface';
import { DayOfWeek } from '../../../domain/entities/user-availability.entity'; // Importado de 559

export class DeleteUserAvailabilityController {
  constructor(private readonly userAvailabilityRepository: IUserAvailabilityRepository) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { dayOfWeek } = req.params;
      
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const userId = req.user.userId;
      const normalizedDay = dayOfWeek as DayOfWeek; 

      const validDays: DayOfWeek[] = [
        DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY
      ];
      
      if (!validDays.includes(normalizedDay)) {
        res.status(400).json({ success: false, message: `Invalid dayOfWeek: ${dayOfWeek}` });
        return;
      }

      await this.userAvailabilityRepository.deleteByUserIdAndDay(userId, normalizedDay);

      res.status(200).json({
        success: true,
        message: `Availability for ${normalizedDay} deleted successfully`
      });
    } catch (error) {
      console.error('❌ Error deleting availability:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting user availability'
      });
    }
  }
}