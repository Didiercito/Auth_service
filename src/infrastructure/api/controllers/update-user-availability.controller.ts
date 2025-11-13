import { Request, Response } from 'express';
import { UpdateUserAvailabilityUseCase } from '../../../application/use-cases/update-user-availability.use-case';
import { DayOfWeek } from '../../../domain/entities/user-availability.entity';

export class UpdateUserAvailabilityController {
  constructor(private readonly updateUserAvailabilityUseCase: UpdateUserAvailabilityUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { dayOfWeek } = req.params;
      const { startTime, endTime } = req.body;
      
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const validDays: string[] = Object.values(DayOfWeek);
      if (!validDays.includes(dayOfWeek.toLowerCase())) {
         res.status(400).json({ success: false, message: `Invalid dayOfWeek: ${dayOfWeek}` });
         return;
      }

      const result = await this.updateUserAvailabilityUseCase.execute({
        userId,
        dayOfWeek: dayOfWeek as DayOfWeek, 
        startTime,
        endTime
      });
      
      res.status(200).json({
        success: true,
        message: 'Availability updated successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error updating availability'
      });
    }
  };
}