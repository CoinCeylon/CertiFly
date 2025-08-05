"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const router = (0, express_1.Router)();
const dashboardController = new dashboard_controller_1.DashboardController();
// DASHBOARD & ANALYTICS ENDPOINTS
router.get('/overview', (req, res) => dashboardController.getDashboard(req, res));
router.get('/batch/:batchId/stats', (req, res) => dashboardController.getBatchStatistics(req, res));
router.get('/process-logs', (req, res) => dashboardController.getProcessLogs(req, res));
exports.default = router;
