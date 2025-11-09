import { Request, Response } from 'express';
import { GetUserSkillsUseCase } from '../../../application/use-cases/get-user-skills.use-case';

export class GetUserSkillsController {
  constructor(private readonly getUserSkillsUseCase: GetUserSkillsUseCase) {}

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

      const dto = { userId: userId };
      const skills = await this.getUserSkillsUseCase.execute(dto);

      res.status(200).json({
        success: true,
        data: skills
      });
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error getting user skills'
      });
    }
  };
}