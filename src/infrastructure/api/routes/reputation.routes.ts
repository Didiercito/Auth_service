import { Router } from 'express';
import {
  updateUserReputationController,
  getUserReputationHistoryController
} from '../dependencies/dependencies';

const router = Router();

router.get('/:userId/history', getUserReputationHistoryController.handle.bind(getUserReputationHistoryController));

router.post('/:userId', updateUserReputationController.handle.bind(updateUserReputationController));

export default router;