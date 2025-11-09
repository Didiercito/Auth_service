import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.use-case';

export class RegisterUserController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body;
      
      if (!dto.email || !dto.password || !dto.names || !dto.firstLastName || !dto.secondLastName || !dto.stateId || !dto.municipalityId) {
         res.status(422).json({
          success: false,
          message: 'Validation failed: Missing required fields.'
        });
        return;
      }
      
      const result = await this.registerUserUseCase.execute(dto);
      
      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            names: result.user.names,
            fullName: `${result.user.names} ${result.user.firstLastName} ${result.user.secondLastName}`,
            status: result.user.status,
            verifiedEmail: result.user.verifiedEmail,
            verifiedPhone: result.user.verifiedPhone
          }
        }
      });
    } catch (error: any) {
      if (error.http_status) {
        res.status(error.http_status).json({
          success: false,
          message: error.message || 'Registration failed',
          ...(error.validations && { validations: error.validations })
        });
      } else {
        console.error('Register error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }
}