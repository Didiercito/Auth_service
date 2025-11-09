import { Request, Response } from 'express';
import { GetUserPermissionsUseCase } from '../../../application/use-cases/get-user-permissions.use-case';

export class GetUserPermissionsController {
  constructor(private readonly getUserPermissionsUseCase: GetUserPermissionsUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const userIdParam = parseInt(req.params.userId);
      const userIdToken = req.user?.userId;
      
      const userId = userIdParam || userIdToken;
      
      if (isNaN(userId!)) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }
      
      const dto = { userId: userId };

      const result = await this.getUserPermissionsUseCase.execute(dto);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('Get user permissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}