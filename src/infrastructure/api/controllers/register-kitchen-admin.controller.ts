import { Request, Response } from 'express';
import { RegisterKitchenAdminUseCase } from '../../../application/use-cases/register-kitchen-admin.use-case';

export class RegisterKitchenAdminController {
  constructor(
    private readonly registerKitchenAdminUseCase: RegisterKitchenAdminUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body;
      
      // Mínima validación de existencia de bloques
      if (!dto.responsibleData || !dto.kitchenData || !dto.locationData) {
        res.status(400).json({
          success: false,
          message: 'Missing required data sections (responsibleData, kitchenData, locationData)'
        });
        return;
      }

      const result = await this.registerKitchenAdminUseCase.execute(dto);

      res.status(201).json(result);
    } catch (error: any) {
      console.error('Error in RegisterKitchenAdminController:', error);
      if (error.http_status) {
        res.status(error.http_status).json({
          success: false,
          message: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}