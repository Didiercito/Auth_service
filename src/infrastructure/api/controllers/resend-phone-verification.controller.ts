import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ResendPhoneVerificationUseCase } from '../../../application/use-cases/resend-phone-verification.use-case';
import { ResendPhoneVerificationDto } from '../../../application/dtos/resend-phone-verification.dto';

export class ResendPhoneVerificationController {
  constructor(private readonly resendPhoneVerificationUseCase: ResendPhoneVerificationUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const [dto] = plainToClass(ResendPhoneVerificationDto, req.body);

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

      const result = await this.resendPhoneVerificationUseCase.execute(dto);

      res.status(200).json({
        success: true,
        message: result.message,
        ...(result.code && { code: result.code }) 
      });
    } catch (error: any) {
      if (error.http_status) {
        res.status(error.http_status).json({
          success: false,
          message: error.message || 'Resend phone verification failed'
        });
      } else {
        console.error('Resend phone verification error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }
}