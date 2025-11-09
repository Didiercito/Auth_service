import { Router } from 'express';
import {
  createUserScheduleController,
  updateUserScheduleController,
  deleteUserScheduleController,
  getUserSchedulesController
} from '../dependencies/dependencies';
import { AuthMiddleware } from '../../../middleware/auth.middleware'; 

const router = Router();
const authMiddleware = new AuthMiddleware(); 

router.get('/user/:userId', authMiddleware.authenticate, getUserSchedulesController.handle.bind(getUserSchedulesController));

router.post('/', authMiddleware.authenticate, createUserScheduleController.handle.bind(createUserScheduleController));

router.put('/:id', authMiddleware.authenticate, updateUserScheduleController.handle.bind(updateUserScheduleController));

router.delete('/:id', authMiddleware.authenticate, deleteUserScheduleController.handle.bind(deleteUserScheduleController));

export default router;