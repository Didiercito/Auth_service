import { Request, Response } from 'express';
import { VerifyEmailUseCase } from '../../../application/use-cases/verify-email.use-case';

export class VerifyEmailController {
  constructor(private readonly verifyEmailUseCase: VerifyEmailUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const token = req.params.token || req.body.token;
      
      if (!token) {
        res.status(400).json({
          success: false,
          message: 'Token is required'
        });
        return;
      }
      
      const dto = { token: token };
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