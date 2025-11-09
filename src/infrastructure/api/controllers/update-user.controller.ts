import { Request, Response } from 'express';
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.use-case';

export class UpdateUserController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }
      
      const dto = {
        userId: userId,
        names: req.body.names,
        firstLastName: req.body.firstLastName,
        secondLastName: req.body.secondLastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        imageProfile: req.body.imageProfile,
        status: req.body.status,
        reputationScore: req.body.reputationScore,
        stateId: req.body.stateId,
        municipalityId: req.body.municipalityId
      };

      const updatedUser = await this.updateUserUseCase.execute(dto);
      
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error updating user',
        validations: error.validations
      });
    }
  };
}