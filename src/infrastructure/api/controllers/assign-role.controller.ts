import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AssignRoleUseCase } from '../../../application/use-cases/assign-role.use-case';
import { AssignRoleDto } from '../../../application/dtos/assign-role.dto';

export class AssignRoleController {
  constructor(private readonly assignRoleUseCase: AssignRoleUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const [dto] = plainToClass(AssignRoleDto, {
        ...req.body,
        assignedBy: req.user?.userId 
      });

      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(422).json({
          success: false,
          message: 'Validation failed',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
        return;
      }

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