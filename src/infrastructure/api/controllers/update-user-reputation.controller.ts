import { Request, Response } from 'express';
import { UpdateUserReputationUseCase } from '../../../application/use-cases/update-user-reputation.use-case';

export class UpdateUserReputationController {
  constructor(private readonly updateUserReputationUseCase: UpdateUserReputationUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const createdBy = req.user?.userId;
      const changeAmount = req.body.changeAmount;

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }
      if (changeAmount === undefined) {
         res.status(400).json({
          success: false,
          message: 'changeAmount is required'
        });
        return;
      }

      const dto = {
        userId: userId,
        changeAmount: changeAmount,
        reason: req.body.reason,
        details: req.body.details,
        relatedEventId: req.body.relatedEventId,
        createdBy: createdBy
      };
      
      const history = await this.updateUserReputationUseCase.execute(dto);

      res.status(200).json({
        success: true,
        message: 'Reputation updated successfully',
        data: history
      });
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error updating reputation',
        validations: error.validations
      });
    }
  };
}