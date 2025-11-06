import { Router } from 'express';
import {
  getSkillsController,
  getUserSkillsController,
  addUserSkillController,
  removeUserSkillController
} from '../dependencies/dependencies';

const router = Router();

router.get('/', getSkillsController.handle.bind(getSkillsController));

router.get('/user/:userId', getUserSkillsController.handle.bind(getUserSkillsController));

router.post('/me', addUserSkillController.handle.bind(addUserSkillController));

router.delete('/me/:skillId', removeUserSkillController.handle.bind(removeUserSkillController));

export default router;