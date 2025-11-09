import { Request, Response } from 'express';
import { ValidateTokenUseCase } from '../../../application/use-cases/validate-token.use-case';

export class ValidateTokenController {
  constructor(private readonly validateTokenUseCase: ValidateTokenUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || req.body.token;
      
      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Token is required'
        });
        return;
      }
      
      const dto = { token: token };

      const result = await this.validateTokenUseCase.execute(dto);
      
      if (!result.isValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('Validate token error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  }
}