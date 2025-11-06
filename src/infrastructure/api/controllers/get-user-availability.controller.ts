import { Request, Response } from 'express';
import { GetUserAvailabilityUseCase } from '../../../application/use-cases/get-user-availability.use-case';
import { GetUserAvailabilityDto } from '../../../application/dtos/get-user-availability.dto';
import { DayOfWeek } from '../../../domain/entities/user-availability.entity';

export class GetUserAvailabilityController {
  constructor(private readonly getUserAvailabilityUseCase: GetUserAvailabilityUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const dayOfWeek = req.query.dayOfWeek as DayOfWeek;

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const dto = new GetUserAvailabilityDto(userId, dayOfWeek);
      const availability = await this.getUserAvailabilityUseCase.execute(dto);

      res.status(200).json({
        success: true,
        data: availability
      });
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error getting availability'
      });
    }
  };
}