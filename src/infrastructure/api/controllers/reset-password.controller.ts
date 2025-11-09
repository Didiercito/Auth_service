import { Request, Response } from 'express';
import { ResetPasswordUseCase } from '../../../application/use-cases/reset-password.use-case';

export class ResetPasswordController {
  constructor(private readonly resetPasswordUseCase: ResetPasswordUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const token = req.body.token;
      const newPassword = req.body.newPassword;

      if (!token || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Token and newPassword are required'
        });
        return;
      }
      
      const dto = { token: token, newPassword: newPassword };
      const result = await this.resetPasswordUseCase.execute(dto);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      if (error.http_status) {
        res.status(error.http_status).json({
          success: false,
          message: error.message || 'Password reset failed',
          ...(error.validations && { validations: error.validations })
        });
      } else {
        console.error('Reset password error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }
}