import { Router } from 'express';
import { VerificationController } from '../controllers/verification.controller';

const router = Router();
const verificationController = new VerificationController();


// PUBLIC VERIFICATION ENDPOINTS
router.post('/certificate', (req, res) => verificationController.verifyCertificate(req, res));
router.get('/search', (req, res) => verificationController.searchCertificate(req, res));
router.get('/student/:studentId', (req, res) => verificationController.getStudentCertificate(req, res));

export default router;
