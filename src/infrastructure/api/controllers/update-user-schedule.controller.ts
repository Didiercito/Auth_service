import { Request, Response } from 'express';
import { UpdateUserScheduleUseCase } from '../../../application/use-cases/update-user-schedule.use-case';
import { UpdateScheduleDto } from '../../../application/dtos/update-schedule.dto';

export class UpdateUserScheduleController {
  constructor(private readonly updateUserScheduleUseCase: UpdateUserScheduleUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const scheduleId = parseInt(req.params.id);

      if (isNaN(scheduleId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid schedule ID'
        });
        return;
      }

      let startDateTime: Date | undefined;
      let endDateTime: Date | undefined;

      if (req.body.startDateTime) {
        startDateTime = new Date(req.body.startDateTime);
        if (isNaN(startDateTime.getTime())) {
          res.status(400).json({
            success: false,
            message: 'Invalid start date format'
          });
          return;
        }
      }

      if (req.body.endDateTime) {
        endDateTime = new Date(req.body.endDateTime);
        if (isNaN(endDateTime.getTime())) {
          res.status(400).json({
            success: false,
            message: 'Invalid end date format'
          });
          return;
        }
      }

      const dto = new UpdateScheduleDto(
        scheduleId,
        startDateTime,
        endDateTime,
        req.body.notes,
        req.body.eventId
      );

      const schedule = await this.updateUserScheduleUseCase.execute(dto);

      res.status(200).json({
        success: true,
        message: 'Schedule updated successfully',
        data: schedule
      });
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error updating schedule',
        validations: error.validations
      });
    }
  };
}