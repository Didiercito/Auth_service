import { Request, Response } from 'express';
import { GetUserAvailabilityUseCase } from '../../../application/use-cases/get-user-availability.use-case';

export class GetMyAvailabilityController {
  constructor(private readonly getUserAvailabilityUseCase: GetUserAvailabilityUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId; 
      const dayOfWeek = req.query.dayOfWeek as string;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized: User ID not found in token'
        });
        return;
      }

      const dto = { userId: userId, dayOfWeek: dayOfWeek };
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