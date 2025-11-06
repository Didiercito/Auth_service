import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { LoginUserUseCase } from '../../../application/use-cases/login-user.use-case';
import { LoginUserDto } from '../../../application/dtos/login-user.dto';

export class LoginUserController {
  constructor(private readonly loginUserUseCase: LoginUserUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const [dto] = plainToClass(LoginUserDto, req.body);

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