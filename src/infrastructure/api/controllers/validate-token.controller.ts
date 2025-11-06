import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidateTokenUseCase } from '../../../application/use-cases/validate-token.use-case';
import { ValidateTokenDto } from '../../../application/dtos/validate-token.dto';

export class ValidateTokenController {
  constructor(private readonly validateTokenUseCase: ValidateTokenUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || req.body.token;
      const dto = plainToClass(ValidateTokenDto, { token });

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

      const result = await this.validateTokenUseCase.execute(dto);

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