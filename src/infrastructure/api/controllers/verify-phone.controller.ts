import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { VerifyPhoneUseCase } from '../../../application/use-cases/verify-phone.use-case';
import { VerifyPhoneDto } from '../../../application/dtos/verify-phone.dto';

export class VerifyPhoneController {
  constructor(private readonly verifyPhoneUseCase: VerifyPhoneUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const [dto] = plainToClass(VerifyPhoneDto, req.body);

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

      const result = await this.verifyPhoneUseCase.execute(dto);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      if (error.http_status) {
        res.status(error.http_status).json({
          success: false,
          message: error.message || 'Phone verification failed'
        });
      } else {
        console.error('Verify phone error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }
}