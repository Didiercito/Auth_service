import { Request, Response } from 'express';
import { LoginUserUseCase } from '../../../application/use-cases/login-user.use-case';

export class LoginUserController {
  constructor(private readonly loginUserUseCase: LoginUserUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body;
      
      if (!dto.email || !dto.password) {
         res.status(422).json({
          success: false,
          message: 'Validation failed',
          errors: [{ property: 'email', constraints: { isNotEmpty: 'Email is required' } },
                   { property: 'password', constraints: { isNotEmpty: 'Password is required' } }]
        });
        return;
      }

      const result = await this.loginUserUseCase.execute(dto);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      if (error.http_status) {
        res.status(error.http_status).json({
          success: false,
          message: error.message || 'Login failed'
        });
      } else {
        console.error('Login error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }
}