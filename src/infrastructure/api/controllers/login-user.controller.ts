import { Request, Response } from 'express';
import { LoginUserUseCase } from '../../../application/use-cases/login-user.use-case';

export class LoginUserController {
  constructor(private readonly loginUserUseCase: LoginUserUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(422).json({
          success: false,
          message: 'Validation failed',
          errors: {
            email: !email ? 'Email is required' : undefined,
            password: !password ? 'Password is required' : undefined
          }
        });
        return;
      }

      const result = await this.loginUserUseCase.execute({ email, password });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });

    } catch (error: any) {
      console.error('Login error:', error);

      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
}