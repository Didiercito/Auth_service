import { Router } from 'express';
import {
  verifyEmailController,
  resendEmailVerificationController,
  verifyPhoneController,
  resendPhoneVerificationController
} from '../dependencies/dependencies';

const router = Router();

router.get('/email/:token', verifyEmailController.handle.bind(resendEmailVerificationController));

router.post('/email/resend', resendEmailVerificationController.handle.bind(resendEmailVerificationController));

router.post('/phone', verifyPhoneController.handle.bind(verifyPhoneController));

router.post('/phone/resend', resendPhoneVerificationController.handle.bind(resendPhoneVerificationController));

export default router;