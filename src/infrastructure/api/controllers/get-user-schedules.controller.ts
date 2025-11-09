import { Request, Response } from 'express';
import { GetUserSchedulesUseCase } from '../../../application/use-cases/get-user-schedules.use-case';

export class GetUserSchedulesController {
  constructor(private readonly getUserSchedulesUseCase: GetUserSchedulesUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;

      const dto = {
        userId: userId,
        startDate: startDate,
        endDate: endDate,
        eventId: eventId,
        page: page,
        limit: limit
      };
      
      const result = await this.getUserSchedulesUseCase.execute(dto);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        }
      });
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error getting schedules'
      });
    }
  };
}