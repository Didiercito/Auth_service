import { Request, Response } from 'express';
import { ResendPhoneVerificationUseCase } from '../../../application/use-cases/resend-phone-verification.use-case';

export class ResendPhoneVerificationController {
  constructor(private readonly resendPhoneVerificationUseCase: ResendPhoneVerificationUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.body.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }
      
      const dto = { userId: userId };
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