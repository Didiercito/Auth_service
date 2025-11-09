import { Request, Response } from 'express';
import { CheckUserPermissionUseCase } from '../../../application/use-cases/check-user-permission.use-case';

export class CheckUserPermissionController {
  constructor(private readonly checkUserPermissionUseCase: CheckUserPermissionUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId) || req.user!.userId;
      const module = req.body.module || req.query.module as string;
      const action = req.body.action || req.query.action as string;
      const resource = req.body.resource || req.query.resource as string;
      
      if (!module || !action || !resource) {
        res.status(400).json({
          success: false,
          message: 'Module, action, and resource are required'
        });
        return;
      }

      const dto = {
        userId: userId,
        module: module,
        action: action,
        resource: resource
      };

      const result = await this.checkUserPermissionUseCase.execute(dto);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('Check user permission error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}