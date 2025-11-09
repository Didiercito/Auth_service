import { Request, Response } from 'express';
import { AssignRoleUseCase } from '../../../application/use-cases/assign-role.use-case';

export class AssignRoleController {
  constructor(private readonly assignRoleUseCase: AssignRoleUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.body.userId);
      const roleId = parseInt(req.body.roleId);
      const assignedBy = req.user?.userId;

      if (isNaN(userId) || isNaN(roleId)) {
         res.status(400).json({
          success: false,
          message: 'User ID and Role ID must be valid numbers'
        });
        return;
      }
      
      const dto = {
        userId: userId,
        roleId: roleId,
        isPrimary: req.body.isPrimary || false,
        assignedBy: assignedBy
      };

      const result = await this.assignRoleUseCase.execute(dto);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      if (error.http_status) {
        res.status(error.http_status).json({
          success: false,
          message: error.message || 'Role assignment failed'
        });
      } else {
        console.error('Assign role error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }
}