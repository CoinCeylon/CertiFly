import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const router = Router();
const dashboardController = new DashboardController();


// DASHBOARD & ANALYTICS ENDPOINTS

router.get('/overview', (req, res) => dashboardController.getDashboard(req, res));
router.get('/batch/:batchId/stats', (req, res) => dashboardController.getBatchStatistics(req, res));
router.get('/process-logs', (req, res) => dashboardController.getProcessLogs(req, res));

export default router;
