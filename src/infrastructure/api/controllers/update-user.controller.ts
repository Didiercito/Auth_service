import { Request, Response } from 'express';
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.use-case';
import { UpdateUserDto } from '../../../application/dtos/update-user.dto';

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

      const dto = new UpdateUserDto(
        userId,
        req.body.names,
        req.body.firstLastName,
        req.body.secondLastName,
        req.body.email,
        req.body.phoneNumber,
        req.body.imageProfile,
        req.body.status,
        req.body.reputationScore,
        req.body.stateId,
        req.body.municipalityId
      );

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