import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { VerifyEmailUseCase } from '../../../application/use-cases/verify-email.use-case';
import { VerifyEmailDto } from '../../../application/dtos/verify-email.dto';

export class VerifyEmailController {
  constructor(private readonly verifyEmailUseCase: VerifyEmailUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const dto = plainToClass(VerifyEmailDto, { token: req.params.token || req.body.token });

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

      const result = await this.verifyEmailUseCase.execute(dto);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      if (error.http_status) {
        res.status(error.http_status).json({
          success: false,
          message: error.message || 'Email verification failed'
        });
      } else {
        console.error('Verify email error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }
}