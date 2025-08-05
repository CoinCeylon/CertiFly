"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const router = (0, express_1.Router)();
const dashboardController = new dashboard_controller_1.DashboardController();
// SYSTEM & HEALTH ENDPOINTS
router.get('/', (req, res) => dashboardController.getSystemHealth(req, res));
exports.default = router;
