import { Router } from 'express';
import {
  createUserScheduleController,
  updateUserScheduleController,
  deleteUserScheduleController,
  getUserSchedulesController
} from '../dependencies/dependencies';

const router = Router();

router.get('/user/:userId', getUserSchedulesController.handle.bind(getUserSchedulesController));

router.post('/', createUserScheduleController.handle.bind(createUserScheduleController));

router.put('/:id', updateUserScheduleController.handle.bind(updateUserScheduleController));

router.delete('/:id', deleteUserScheduleController.handle.bind(deleteUserScheduleController));

export default router;