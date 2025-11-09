import { Request, Response } from 'express';
import { RemoveUserSkillUseCase } from '../../../application/use-cases/remove-user-skill.use-case';

export class RemoveUserSkillController {
  constructor(private readonly removeUserSkillUseCase: RemoveUserSkillUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const skillId = parseInt(req.params.skillId);

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      if (isNaN(skillId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid skill ID'
        });
        return;
      }

      const dto = { userId: userId, skillId: skillId };
      await this.removeUserSkillUseCase.execute(dto);
      
      res.status(200).json({
        success: true,
        message: 'Skill removed successfully'
      });
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error removing skill'
      });
    }
  };
}