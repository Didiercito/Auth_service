import { Request, Response } from 'express';
import { GetSkillsUseCase } from '../../../application/use-cases/get-skills.use-case';
import { GetSkillsDto } from '../../../application/dtos/get-skills.dto';

export class GetSkillsController {
  constructor(private readonly getSkillsUseCase: GetSkillsUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const search = req.query.search as string;
      const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;

      const dto = new GetSkillsDto(page, limit, search, isActive);
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