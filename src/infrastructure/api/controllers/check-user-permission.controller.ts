import { Request, Response } from 'express';
import { CheckUserPermissionUseCase, CheckUserPermissionDto } from '../../../application/use-cases/check-user-permission.use-case';

export class CheckUserPermissionController {
  constructor(private readonly checkUserPermissionUseCase: CheckUserPermissionUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const dto: CheckUserPermissionDto = {
        userId: parseInt(req.params.userId) || req.user!.userId,
        module: req.body.module || req.query.module as string,
        action: req.body.action || req.query.action as string,
        resource: req.body.resource || req.query.resource as string
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