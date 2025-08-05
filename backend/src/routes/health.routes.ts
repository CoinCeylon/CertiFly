import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const router = Router();
const dashboardController = new DashboardController();


// SYSTEM & HEALTH ENDPOINTS
router.get('/', (req, res) => dashboardController.getSystemHealth(req, res));

export default router;
