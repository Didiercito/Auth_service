import { Request, Response } from 'express';
import { GetSkillsUseCase } from '../../../application/use-cases/get-skills.use-case';

export class GetSkillsController {
  constructor(private readonly getSkillsUseCase: GetSkillsUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const search = req.query.search as string;
      
      let isActive: boolean | undefined = undefined;
      if (req.query.isActive !== undefined) {
          isActive = req.query.isActive === 'true';
      }
      
      const dto = {
          page: page,
          limit: limit,
          search: search,
          isActive: isActive
      };
      
      const result = await this.getSkillsUseCase.execute(dto);

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
        message: error.message || 'Error getting skills'
      });
    }
  };
}