import { Router } from 'express';
import {
  getUserByIdController,
  getUsersPaginatedController,
  updateUserController,
  updateProfileController,
  deleteUserController,
  completeProfileController,
  getMyProfileController,
  deleteMyAccountController
} from '../dependencies/dependencies';
import { AuthMiddleware } from '../../../middleware/auth.middleware'; 

const authMiddleware = new AuthMiddleware(); 

const router = Router();

router.get('/', getUsersPaginatedController.handle.bind(getUsersPaginatedController));

router.get('/profile', authMiddleware.authenticate, getMyProfileController.handle.bind(getMyProfileController)); 

router.delete('/me', authMiddleware.authenticate, deleteMyAccountController.handle.bind(deleteMyAccountController));

router.get('/:id', authMiddleware.authenticate, getUserByIdController.handle.bind(getUserByIdController));

router.put('/profile', authMiddleware.authenticate, updateProfileController.handle.bind(updateProfileController));

router.put('/:id', updateUserController.handle.bind(updateUserController));

router.delete('/:id', deleteUserController.handle.bind(deleteUserController));

router.post('/complete-profile', authMiddleware.authenticate, completeProfileController.handle.bind(completeProfileController));

export default router;