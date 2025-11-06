import { Router } from 'express';
import {
  getUserByIdController,
  getUsersPaginatedController,
  updateUserController,
  updateProfileController,
  deleteUserController
} from '../dependencies/dependencies';

const router = Router();

router.get('/', getUsersPaginatedController.handle.bind(getUsersPaginatedController));

router.get('/:id', getUserByIdController.handle.bind(getUserByIdController));

router.put('/profile', updateProfileController.handle.bind(updateProfileController));

router.put('/:id', updateUserController.handle.bind(updateUserController));

router.delete('/:id', deleteUserController.handle.bind(deleteUserController));

export default router;