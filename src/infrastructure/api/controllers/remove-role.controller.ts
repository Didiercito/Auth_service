import { Request, Response } from 'express';
import { RemoveRoleUseCase } from '../../../application/use-cases/remove-role.use-case';

export class RemoveRoleController {
  constructor(private readonly removeRoleUseCase: RemoveRoleUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.body.userId);
      const roleId = parseInt(req.body.roleId);

      if (isNaN(userId) || isNaN(roleId)) {
        res.status(400).json({
          success: false,
          message: 'User ID and Role ID must be valid numbers'
        });
        return;
      }
      
      const dto = { userId: userId, roleId: roleId };
      const result = await this.removeRoleUseCase.execute(dto);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      if (error.http_status) {
        res.status(error.http_status).json({
          success: false,
          message: error.message || 'Role removal failed'
        });
      } else {
        console.error('Remove role error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }
}