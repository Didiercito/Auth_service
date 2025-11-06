import { Request, Response } from 'express';
import { DeleteUserScheduleUseCase } from '../../../application/use-cases/delete-user-schedule.use-case';
import { DeleteScheduleDto } from '../../../application/dtos/delete-schedule.dto';

export class DeleteUserScheduleController {
  constructor(private readonly deleteUserScheduleUseCase: DeleteUserScheduleUseCase) {}

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

      const dto = new DeleteScheduleDto(scheduleId);
      await this.deleteUserScheduleUseCase.execute(dto);

      res.status(200).json({
        success: true,
        message: 'Schedule deleted successfully'
      });
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error deleting schedule'
      });
    }
  };
}