import { Router } from 'express';
import {
  getSkillsController,
  getUserSkillsController,
  addUserSkillController,
  removeUserSkillController
} from '../dependencies/dependencies';
import { AuthMiddleware } from '../../../middleware/auth.middleware'; 

const router = Router();
const authMiddleware = new AuthMiddleware(); 

router.get('/', getSkillsController.handle.bind(getSkillsController));

router.get('/user/:userId', authMiddleware.authenticate, getUserSkillsController.handle.bind(getUserSkillsController));

router.post('/me', authMiddleware.authenticate, addUserSkillController.handle.bind(addUserSkillController));

router.delete('/me/:skillId', authMiddleware.authenticate, removeUserSkillController.handle.bind(removeUserSkillController));

export default router;