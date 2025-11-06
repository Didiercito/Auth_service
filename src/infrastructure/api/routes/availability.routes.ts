import { Router } from 'express';
import {
  setUserAvailabilityController,
  getUserAvailabilityController,
  checkUserAvailabilityController
} from '../dependencies/dependencies';

const router = Router();

router.get('/:userId', getUserAvailabilityController.handle.bind(getUserAvailabilityController));

router.post('/me', setUserAvailabilityController.handle.bind(setUserAvailabilityController));

router.post('/:userId/check', checkUserAvailabilityController.handle.bind(checkUserAvailabilityController));

export default router;