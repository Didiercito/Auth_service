import { Request, Response } from 'express';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-user.use-case';
import { DeleteUserDto } from '../../../application/dtos/delete-user.dto';

export class DeleteUserController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

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

      const dto = new DeleteUserDto(userId);
      await this.deleteUserUseCase.execute(dto);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error deleting user'
      });
    }
  };
}