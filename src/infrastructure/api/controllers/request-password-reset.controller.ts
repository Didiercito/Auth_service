import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { RequestPasswordResetUseCase } from '../../../application/use-cases/request-password-reset.use-case';
import { RequestPasswordResetDto } from '../../../application/dtos/request-password-reset.dto';

export class RequestPasswordResetController {
  constructor(private readonly requestPasswordResetUseCase: RequestPasswordResetUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const [dto] = plainToClass(RequestPasswordResetDto, req.body);

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

      const result = await this.requestPasswordResetUseCase.execute(dto);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      console.error('Request password reset error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}