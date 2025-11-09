import { Request, Response } from 'express';
import { CreateUserScheduleUseCase } from '../../../application/use-cases/create-user-schedule.use-case';

export class CreateUserScheduleController {
  constructor(private readonly createUserScheduleUseCase: CreateUserScheduleUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const startDateTime = new Date(req.body.startDateTime);
      const endDateTime = new Date(req.body.endDateTime);

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
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
        notes: req.body.notes,
        eventId: req.body.eventId ? parseInt(req.body.eventId) : undefined,
        createdBy: userId
      };

      const schedule = await this.createUserScheduleUseCase.execute(dto);

      res.status(201).json({
        success: true,
        message: 'Schedule created successfully',
        data: schedule
      });
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error creating schedule',
        validations: error.validations
      });
    }
  };
}