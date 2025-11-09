import { Request, Response } from 'express';
import { CompleteProfileUseCase } from '../../../application/use-cases/complete-profile.use-case';

export class CompleteProfileController {
  constructor(private readonly completeProfileUseCase: CompleteProfileUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.body.userId);
      
      if (isNaN(userId)) {
         res.status(400).json({
          success: false,
          message: 'User ID is required and must be a number'
        });
        return;
      }
      
      const skillIds = req.body.skillIds;
      if (skillIds && !Array.isArray(skillIds)) {
        res.status(400).json({
          success: false,
          message: 'skillIds must be an array'
        });
        return;
      }
      
      const dto = {
        userId: userId,
        skillIds: skillIds
      };
      
      const result = await this.completeProfileUseCase.execute(dto);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error completing profile'
      });
    }
  };
}