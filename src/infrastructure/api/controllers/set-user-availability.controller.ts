import { Request, Response } from 'express';
import { SetUserAvailabilityUseCase } from '../../../application/use-cases/set-user-availability.use-case';

export class SetUserAvailabilityController {
  constructor(private readonly setUserAvailabilityUseCase: SetUserAvailabilityUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const availabilitySlots = req.body.availabilitySlots;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      if (!Array.isArray(availabilitySlots)) {
         res.status(400).json({
          success: false,
          message: 'availabilitySlots must be an array'
        });
        return;
      }
      
      const dto = { userId: userId, availabilitySlots: availabilitySlots };
      const availability = await this.setUserAvailabilityUseCase.execute(dto);
      
      res.status(200).json({
        success: true,
        message: 'Availability set successfully',
        data: availability
      });
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error setting availability',
        validations: error.validations
      });
    }
  };
}