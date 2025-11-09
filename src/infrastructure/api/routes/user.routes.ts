import { Router } from 'express';
import {
  getUserByIdController,
  getUsersPaginatedController,
  updateUserController,
  updateProfileController,
  deleteUserController,
  completeProfileController
} from '../dependencies/dependencies';
import { AuthMiddleware } from '../../../middleware/auth.middleware'; 

const authMiddleware = new AuthMiddleware(); 

const router = Router();

router.get('/', getUsersPaginatedController.handle.bind(getUsersPaginatedController));

router.get('/:id', authMiddleware.authenticate, getUserByIdController.handle.bind(getUserByIdController));

router.put('/profile', authMiddleware.authenticate, updateProfileController.handle.bind(updateProfileController));

router.put('/:id', updateUserController.handle.bind(updateUserController));

router.delete('/:id', deleteUserController.handle.bind(deleteUserController));

router.post('/complete-profile', authMiddleware.authenticate, completeProfileController.handle.bind(completeProfileController));

export default router;