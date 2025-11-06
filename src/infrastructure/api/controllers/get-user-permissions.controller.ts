import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { GetUserPermissionsUseCase } from '../../../application/use-cases/get-user-permissions.use-case';
import { GetUserPermissionsDto } from '../../../application/dtos/get-user-permissions.dto';

export class GetUserPermissionsController {
  constructor(private readonly getUserPermissionsUseCase: GetUserPermissionsUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const dto = plainToClass(GetUserPermissionsDto, {
        userId: parseInt(req.params.userId) || req.user?.userId
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