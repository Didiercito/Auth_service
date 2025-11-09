import { Request, Response } from 'express';
import { GetUserByIdUseCase } from '../../../application/use-cases/get-user-by-id.use-case';

export class GetUserByIdController {
  constructor(private readonly getUserByIdUseCase: GetUserByIdUseCase) {}

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

      const dto = { userId: userId };
      const user = await this.getUserByIdUseCase.execute(dto);

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error getting user'
      });
    }
  };
}