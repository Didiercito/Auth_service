import { Request, Response } from 'express';
import { CheckUserAvailabilityUseCase } from '../../../application/use-cases/check-user-availability.use-case';

export class CheckUserAvailabilityController {
  constructor(private readonly checkUserAvailabilityUseCase: CheckUserAvailabilityUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const startDateTime = new Date(req.body.startDateTime);
      const endDateTime = new Date(req.body.endDateTime);
      const dayOfWeek = req.body.dayOfWeek;

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Invalid date format'
        });
        return;
      }

      const dto = {
        userId: userId,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        dayOfWeek: dayOfWeek
      };
      
      const result = await this.checkUserAvailabilityUseCase.execute(dto);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error checking availability'
      });
    }
  };
}