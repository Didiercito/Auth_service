import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { RemoveRoleUseCase } from '../../../application/use-cases/remove-role.use-case';
import { RemoveRoleDto } from '../../../application/dtos/remove-role.dto';

export class RemoveRoleController {
  constructor(private readonly removeRoleUseCase: RemoveRoleUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const [dto] = plainToClass(RemoveRoleDto, req.body);

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