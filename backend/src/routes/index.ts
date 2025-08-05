import { Router } from 'express';
import icbtRoutes from './icbt.routes';
import cardiffRoutes from './cardiff.routes';
import verificationRoutes from './verification.routes';
import dashboardRoutes from './dashboard.routes';
import testRoutes from './test.routes';

const router = Router();

// Mount route modules
router.use('/icbt', icbtRoutes);
router.use('/cardiff', cardiffRoutes);
router.use('/verify', verificationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/test', testRoutes);

export default router;
