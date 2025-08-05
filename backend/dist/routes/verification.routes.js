"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verification_controller_1 = require("../controllers/verification.controller");
const router = (0, express_1.Router)();
const verificationController = new verification_controller_1.VerificationController();
// PUBLIC VERIFICATION ENDPOINTS
router.post('/certificate', (req, res) => verificationController.verifyCertificate(req, res));
router.get('/search', (req, res) => verificationController.searchCertificate(req, res));
router.get('/student/:studentId', (req, res) => verificationController.getStudentCertificate(req, res));
exports.default = router;
