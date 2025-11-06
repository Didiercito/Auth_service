import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ResendEmailVerificationUseCase } from '../../../application/use-cases/resend-email-verification.use-case';
import { ResendEmailVerificationDto } from '../../../application/dtos/resend-email-verification.dto';

export class ResendEmailVerificationController {
  constructor(private readonly resendEmailVerificationUseCase: ResendEmailVerificationUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const [dto] = plainToClass(ResendEmailVerificationDto, req.body);

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

      const result = await this.resendEmailVerificationUseCase.execute(dto);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      if (error.http_status) {
        res.status(error.http_status).json({
          success: false,
          message: error.message || 'Resend verification failed'
        });
      } else {
        console.error('Resend email verification error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }
}