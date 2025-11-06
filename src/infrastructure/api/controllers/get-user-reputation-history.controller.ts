import { Request, Response } from 'express';
import { GetUserReputationHistoryUseCase } from '../../../application/use-cases/get-user-reputation-history.use-case';
import { GetReputationHistoryDto } from '../../../application/dtos/get-reputation-history.dto';

export class GetUserReputationHistoryController {
  constructor(private readonly getUserReputationHistoryUseCase: GetUserReputationHistoryUseCase) {}

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

      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (req.query.startDate) {
        startDate = new Date(req.query.startDate as string);
      }

      if (req.query.endDate) {
        endDate = new Date(req.query.endDate as string);
      }

      const dto = new GetReputationHistoryDto(
        userId,
        startDate,
        endDate,
        page,
        limit
      );

      const result = await this.getUserReputationHistoryUseCase.execute(dto);

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
        message: error.message || 'Error getting reputation history'
      });
    }
  };
}