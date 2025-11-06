import { Request, Response } from 'express';
import { UpdateProfileUseCase } from '../../../application/use-cases/update-profile.use-case';
import { UpdateProfileDto } from '../../../application/dtos/update-profile.dto';

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

      const dto = new UpdateProfileDto(
        req.body.names,
        req.body.firstLastName,
        req.body.secondLastName,
        req.body.phoneNumber,
        req.body.imageProfile,
        req.body.stateId,
        req.body.municipalityId
      );

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