import { Request, Response } from 'express';
import { DeleteMyAccountUseCase } from '../../../application/use-cases/delete-my-account.use-case';

export class DeleteMyAccountController {
  constructor(private readonly deleteMyAccountUseCase: DeleteMyAccountUseCase) {}

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

      const result = await this.deleteMyAccountUseCase.execute(userId);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      console.error('Delete account error:', error);
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error deleting account'
      });
    }
  };
}