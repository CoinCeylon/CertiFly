"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const icbt_controller_1 = require("../controllers/icbt.controller");
const router = (0, express_1.Router)();
const icbtController = new icbt_controller_1.ICBTController();
// TEST ENDPOINTS
router.get('/icbt-firefly', (req, res) => icbtController.testFireFlyConnection(req, res));
router.get('/firefly-connection', (req, res) => icbtController.testFireFlyConnection(req, res));
exports.default = router;
