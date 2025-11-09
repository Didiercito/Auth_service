import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.use-case';
import { RegisterUserDto } from '../../../application/dtos/register-user.dto';

export class RegisterUserController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const dto = new RegisterUserDto(
        req.body.names,
        req.body.firstLastName,
        req.body.secondLastName,
        req.body.email,
        req.body.password,
        req.body.stateId,
        req.body.municipalityId,
        req.body.phoneNumber
      );
      
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
          },
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
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