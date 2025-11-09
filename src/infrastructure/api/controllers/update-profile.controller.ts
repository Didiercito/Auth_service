import { Request, Response } from 'express';
import { UpdateProfileUseCase } from '../../../application/use-cases/update-profile.use-case';

export class UpdateProfileController {
  constructor(private readonly updateProfileUseCase: UpdateProfileUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      // Pasamos todo el body al caso de uso, dejando la validación de campos opcionales al CU
      const dto = req.body; 

      const updatedUser = await this.updateProfileUseCase.execute(userId, dto);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error updating profile',
        validations: error.validations
      });
    }
  };
}