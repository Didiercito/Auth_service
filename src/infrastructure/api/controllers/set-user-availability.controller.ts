import { Request, Response } from 'express';
import { SetUserAvailabilityUseCase } from '../../../application/use-cases/set-user-availability.use-case';

export class SetUserAvailabilityController {
  constructor(private readonly setUserAvailabilityUseCase: SetUserAvailabilityUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.userId; 
      
      if (!userId) {
        return res.status(401).json({ message: 'Token inválido o no proporcionado' }); 
      }

      const { availabilitySlots } = req.body;
      
      if (!Array.isArray(availabilitySlots)) {
        return res.status(400).json({
          message: 'El campo "availabilitySlots" debe ser un arreglo de objetos válidos', 
        });
      }

      for (const slot of availabilitySlots) {
        if (!slot.dayOfWeek || !slot.startTime || !slot.endTime) {
          return res.status(400).json({
            message: 'Cada slot debe tener dayOfWeek, startTime y endTime', 
          });
        }
      }

      const result = await this.setUserAvailabilityUseCase.execute({
        userId,
        availabilitySlots,
      }); 
      
      return res.status(200).json(result); 
      
    } catch (error: any) {
      console.error('❌ Error en SetUserAvailabilityController:', error);
      return res.status(500).json({
        message: error.message || 'Error al actualizar disponibilidad',
      });
    }
  }
}