import { Request, Response } from 'express';
import { SetUserAvailabilityUseCase } from '../../../application/use-cases/set-user-availability.use-case';
import { SetAvailabilityDto, AvailabilitySlotDto } from '../../../application/dtos/set-availability.dto';

export class SetUserAvailabilityController {
  constructor(private readonly setUserAvailabilityUseCase: SetUserAvailabilityUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const availabilitySlots = req.body.availabilitySlots.map((slot: any) => 
        new AvailabilitySlotDto(slot.dayOfWeek, slot.startTime, slot.endTime)
      );

      const dto = new SetAvailabilityDto(userId, availabilitySlots);
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