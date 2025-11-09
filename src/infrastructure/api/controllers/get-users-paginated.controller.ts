import { Request, Response } from 'express';
import { GetUsersPaginatedUseCase } from '../../../application/use-cases/get-users-paginated.use-case';

export class GetUsersPaginatedController {
  constructor(private readonly getUsersPaginatedUseCase: GetUsersPaginatedUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const status = req.query.status as string;
      const stateId = req.query.stateId ? parseInt(req.query.stateId as string) : undefined;
      const municipalityId = req.query.municipalityId ? parseInt(req.query.municipalityId as string) : undefined;

      const dto = {
        page: page,
        limit: limit,
        search: search,
        status: status,
        stateId: stateId,
        municipalityId: municipalityId
      };
      
      const result = await this.getUsersPaginatedUseCase.execute(dto);

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
        message: error.message || 'Error getting users'
      });
    }
  };
}