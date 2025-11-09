import { Request, Response } from 'express';
import { RequestPasswordResetUseCase } from '../../../application/use-cases/request-password-reset.use-case';

export class RequestPasswordResetController {
  constructor(private readonly requestPasswordResetUseCase: RequestPasswordResetUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const email = req.body.email;
      
      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email is required'
        });
        return;
      }
      
      const dto = { email: email };
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