import { Request, Response } from 'express';
import { RefreshTokenUseCase } from '../../../application/use-cases/refresh-token.use-case';

export class RefreshTokenController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.body.refreshToken;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
        return;
      }
      
      const dto = { refreshToken: refreshToken };
      const result = await this.refreshTokenUseCase.execute(dto);
      
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (error: any) {
      if (error.http_status) {
        res.status(error.http_status).json({
          success: false,
          message: error.message || 'Token refresh failed'
        });
      } else {
        console.error('Refresh token error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }
}